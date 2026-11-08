#!/usr/bin/env python3
"""Unit tests for deterministic schema comparison; no database required."""
import tempfile
import unittest
from pathlib import Path

from restore_schema_test import compare_rows, discover_migrations, exclude_platform_rows


class SchemaDiffTests(unittest.TestCase):
    def test_equal_rows_pass(self):
        rows = [{"schema": "public", "name": "profiles", "definition": "SELECT 1\n"}]
        result = compare_rows("views", rows, rows, ("schema", "name"))
        self.assertEqual(result["missing"], [])
        self.assertEqual(result["unexpected"], [])
        self.assertEqual(result["changed"], [])

    def test_missing_unexpected_and_changed_are_failures(self):
        expected = [
            {"schema": "public", "name": "profiles", "definition": "SELECT 1"},
            {"schema": "public", "name": "nominees", "definition": "SELECT 2"},
        ]
        actual = [
            {"schema": "public", "name": "profiles", "definition": "SELECT 9"},
            {"schema": "public", "name": "extra", "definition": "SELECT 3"},
        ]
        result = compare_rows("views", expected, actual, ("schema", "name"))
        self.assertEqual(result["missing"][0]["key"], ["public", "nominees"])
        self.assertEqual(result["unexpected"][0]["key"], ["public", "extra"])
        self.assertEqual(result["changed"][0]["fields"]["definition"], {
            "expected": "SELECT 1", "actual": "SELECT 9"
        })

    def test_blank_exported_view_definition_is_unverified_not_changed(self):
        expected = [{"schema": "public", "name": "profiles", "view_definition": ""}]
        actual = [{"schema": "public", "name": "profiles", "view_definition": "SELECT 1"}]
        result = compare_rows("views", expected, actual, ("schema", "name"), optional_when_empty=("view_definition",))
        self.assertEqual(result["changed"], [])
        self.assertEqual(result["unverified"], [{"key": ["public", "profiles"], "fields": ["view_definition"]}])

    def test_acl_order_does_not_create_false_drift(self):
        expected = [{"schema": "public", "name": "profiles", "raw_acl": "{b=r/postgres,a=r/postgres}"}]
        actual = [{"schema": "public", "name": "profiles", "raw_acl": "{a=r/postgres,b=r/postgres}"}]
        result = compare_rows("grants", expected, actual, ("schema", "name"))
        self.assertEqual(result["changed"], [])

    def test_harness_role_does_not_create_false_acl_drift(self):
        expected = [{"schema": "public", "name": "profiles", "raw_acl": "{sandbox_exec=ar/postgres,a=r/postgres}"}]
        actual = [{"schema": "public", "name": "profiles", "raw_acl": "{a=r/postgres}"}]
        result = compare_rows("grants", expected, actual, ("schema", "name"))
        self.assertEqual(result["changed"], [])

    def test_platform_exclusion_is_explicit(self):
        rows = [{"extname": "pgcrypto"}, {"extname": "supabase_vault"}]
        kept, excluded = exclude_platform_rows(rows, "extname", {"supabase_vault": "hosted only"})
        self.assertEqual(kept, [{"extname": "pgcrypto"}])
        self.assertEqual(excluded, [{"name": "supabase_vault", "reason": "hosted only"}])

    def test_migration_discovery_sorts_and_enforces_count(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "20260202_second.sql").write_text("SELECT 2;")
            (root / "20260101_first.sql").write_text("SELECT 1;")
            migrations = discover_migrations(root, expected_count=2)
            self.assertEqual([path.name for path in migrations], [
                "20260101_first.sql", "20260202_second.sql"
            ])
            with self.assertRaisesRegex(ValueError, "expected 3 migrations, found 2"):
                discover_migrations(root, expected_count=3)


if __name__ == "__main__":
    unittest.main()
