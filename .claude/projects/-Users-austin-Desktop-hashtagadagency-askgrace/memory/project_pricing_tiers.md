---
name: Pricing & Token Economics Strategy
description: Never-lose-money tier system with dynamic model downgrading, usage caps, and profitability guardrails
type: project
---

Austin wants Ask Grace to never lose money on any individual user. The tier system must be methodically planned so that token costs never exceed revenue per user. Key principles:

- Always offer a free trial on the cheapest model (Haiku)
- Paid tiers use better models but with caps that ensure profitability
- If a user is burning through their allocation too fast, dynamically downgrade the model mid-cycle rather than cutting them off
- Output must remain reliable even on cheaper models (Grace's persona works well on Haiku)
- Plan for Stripe integration when paid tiers launch

**Why:** This is a revenue-critical architectural decision. Every feature that touches the Edge Function, model selection, or usage tracking must respect these economics.

**How to apply:** When building or modifying the chat Edge Function, always check that the tier system, rate limits, and model selection logic are preserved. Never default to an expensive model without a cap.
