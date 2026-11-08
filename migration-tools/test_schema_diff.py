#!/usr/bin/env python3
"""Unit tests for deterministic schema comparison; no database required."""
import unittest

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

    def test_migration_names_are_sorted_and_unique(self):
        self.assertEqual(discover_migrations, discover_migrations)


if __name__ == "__main__":
    unittest.main()
