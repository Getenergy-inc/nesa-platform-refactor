import unittest
from extract_award_candidates import identifiable, normalize_name, classification


class ResearchRules(unittest.TestCase):
    def test_generic_placeholder_is_excluded(self):
        self.assertFalse(identifiable("Other WA early-stage EdTech"))
        self.assertFalse(identifiable("Regional pool from the 100-organisation master list"))
        self.assertFalse(identifiable("UNHCR NGO partners refugee education"))
        self.assertFalse(identifiable("Foundation school support NA"))

    def test_real_named_entities_are_retained(self):
        for name in ["CAMFED", "Street Child", "Room to Read", "Prime STEM Nigeria", "Ghana Robotics Academy Foundation", "Didier Drogba", "Catholic Education Unit, Ghana"]:
            self.assertTrue(identifiable(name), name)

    def test_exact_normalized_name(self):
        self.assertEqual(normalize_name(" CAMFED "), normalize_name("camfed"))

    def test_influencers_remain_separate(self):
        self.assertEqual(classification("NESA_Influencers.pdf", "3. SPORT"), ("africa-sports-influencer-education", "sports"))


if __name__ == "__main__":
    unittest.main()