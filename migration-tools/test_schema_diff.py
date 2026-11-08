#!/usr/bin/env python3
"""Unit tests for deterministic schema comparison; no database required."""
import tempfile
import unittest
from pathlib import Path

from restore_schema_test import compare_rows, discover_migrations


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

    def test_acl_order_does_not_create_false_drift(self):
        expected = [{"schema": "public", "name": "profiles", "raw_acl": "{b=r/postgres,a=r/postgres}"}]
        actual = [{"schema": "public", "name": "profiles", "raw_acl": "{a=r/postgres,b=r/postgres}"}]
        result = compare_rows("grants", expected, actual, ("schema", "name"))
        self.assertEqual(result["changed"], [])

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
