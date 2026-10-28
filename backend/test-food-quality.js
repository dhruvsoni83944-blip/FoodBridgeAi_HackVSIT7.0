/**
 * Verification Test Suite for FoodBridge AI Food Quality Analyzer & Gemini Service
 */
const GeminiVisionService = require('./src/services/geminiVisionService');
const axios = require('axios');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Testing Food Quality & Gemini Vision Analyzer');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test Input Validation without API Key
  console.log('--- TEST GROUP 1: Input Validation & Guardrails ---');
  try {
    await GeminiVisionService.analyzeFoodImage({ imageBuffer: null, mimeType: 'image/jpeg' });
    assert(false, 'Should throw error when imageBuffer is null');
  } catch (err) {
    assert(err.status === 503 || err.status === 400, 'Rejects invalid or unconfigured request properly');
  }

  // 2. Test Scoring Synthesis: Non-food image
  console.log('\n--- TEST GROUP 2: Non-Food Image Handling ---');
  const nonFoodData = {
    isFood: false,
    foodIdentified: 'Smartphone device',
    overallCondition: 'An electronic device is visible on a desk.',
    concerns: ['Image does not contain food']
  };
  const nonFoodResult = GeminiVisionService._synthesizeScoringAndRecommendation(nonFoodData, 'gemini-2.5-flash');
  assert(nonFoodResult.qualityScore === null, 'Non-food image yields null qualityScore');
  assert(nonFoodResult.assessmentConfidence === 'low', 'Non-food image yields low confidence');
  assert(nonFoodResult.recommendation === 'review_required', 'Non-food recommendation is review_required');

  // 3. Test Scoring Synthesis: Fresh Chapati with normal toasted cooking marks
  console.log('\n--- TEST GROUP 3: Normal Browning & Toasted Marks vs Defects ---');
  const toastedChapatiData = {
    isFood: true,
    foodIdentified: 'Fresh Handmade Roti / Chapati',
    foodCategory: 'Cooked Meals',
    overallCondition: 'Freshly prepared flatbread with golden toasted spots.',
    imageQuality: { isAdequate: true, issues: ['none'], explanation: 'Clear focus' },
    indicators: {
      mold_growth: { status: 'not_observed', explanation: 'No fungal growth', confidence: 'high' },
      abnormal_color: { status: 'not_observed', explanation: 'Natural golden wheat color', confidence: 'high' },
      texture_dryness: { status: 'not_observed', explanation: 'Soft and pliable', confidence: 'high' },
      burn_marks: {
        status: 'observed',
        isNormalBrowning: true,
        explanation: 'Surface brown spots represent normal toasted cooking marks from preparation.',
        confidence: 'high'
      },
      visible_contamination: { status: 'not_observed', explanation: 'No foreign objects', confidence: 'high' },
      packaging_condition: { status: 'uncertain', explanation: 'Served on a clean plate', confidence: 'medium' }
    },
    concerns: []
  };
  const chapatiResult = GeminiVisionService._synthesizeScoringAndRecommendation(toastedChapatiData, 'gemini-2.5-flash');
  assert(chapatiResult.qualityScore === 100, `Normal toasted marks are not penalized (Score: ${chapatiResult.qualityScore})`);
  assert(chapatiResult.recommendation === 'no_obvious_visual_concerns', 'Normal chapati is marked no_obvious_visual_concerns');
  assert(chapatiResult.recommendationColor === 'green', 'Result color is green');

  // 4. Test Scoring Synthesis: Moldy / Spoiled Food
  console.log('\n--- TEST GROUP 4: Moldy / Spoiled Food Detection ---');
  const moldyBreadData = {
    isFood: true,
    foodIdentified: 'White Sandwich Bread',
    foodCategory: 'Bakery',
    overallCondition: 'Visible fungal mold patches across top crust.',
    imageQuality: { isAdequate: true, issues: ['none'], explanation: 'Sharp image' },
    indicators: {
      mold_growth: {
        status: 'observed',
        explanation: 'Fuzzy green and grayish-white fungal colonies on bread crust.',
        confidence: 'high'
      },
      abnormal_color: {
        status: 'observed',
        explanation: 'Green discoloration surrounding mold colonies.',
        confidence: 'high'
      },
      texture_dryness: { status: 'observed', explanation: 'Stale and brittle', confidence: 'medium' },
      burn_marks: { status: 'not_observed', isNormalBrowning: false, explanation: 'None', confidence: 'high' },
      visible_contamination: { status: 'observed', explanation: 'Microbial mold spores spreading', confidence: 'high' },
      packaging_condition: { status: 'observed', explanation: 'Open torn wrapper', confidence: 'medium' }
    },
    concerns: ['Fuzzy mold colonies detected', 'Open torn packaging']
  };
  const moldyResult = GeminiVisionService._synthesizeScoringAndRecommendation(moldyBreadData, 'gemini-2.5-flash');
  assert(moldyResult.qualityScore <= 20, `Moldy food score is severely penalized (Score: ${moldyResult.qualityScore})`);
  assert(moldyResult.recommendation === 'visual_concerns_detected', 'Moldy food recommendation is visual_concerns_detected');
  assert(moldyResult.recommendationColor === 'red', 'Result color is red');

  // 5. Test Scoring Synthesis: Blurry Image requiring review
  console.log('\n--- TEST GROUP 5: Blurry / Unclear Image ---');
  const blurryData = {
    isFood: true,
    foodIdentified: 'unknown',
    foodCategory: 'Prepared Surplus',
    overallCondition: 'Cannot discern details due to motion blur and glare.',
    imageQuality: { isAdequate: false, issues: ['blur', 'glare'], explanation: 'Heavy blur' },
    indicators: {
      mold_growth: { status: 'uncertain', explanation: 'Too blurry to detect mold', confidence: 'low' },
      abnormal_color: { status: 'uncertain', explanation: 'Lighting glare affects color', confidence: 'low' },
      texture_dryness: { status: 'uncertain', explanation: 'Details indistinct', confidence: 'low' },
      burn_marks: { status: 'uncertain', isNormalBrowning: true, explanation: 'Uncertain', confidence: 'low' },
      visible_contamination: { status: 'uncertain', explanation: 'Uncertain', confidence: 'low' },
      packaging_condition: { status: 'uncertain', explanation: 'Uncertain', confidence: 'low' }
    },
    concerns: ['Image too blurry for reliable assessment']
  };
  const blurryResult = GeminiVisionService._synthesizeScoringAndRecommendation(blurryData, 'gemini-2.5-flash');
  assert(blurryResult.assessmentConfidence === 'low', 'Blurry image yields low confidence');
  assert(blurryResult.recommendation === 'review_required', 'Blurry image recommendation is review_required');
  assert(blurryResult.recommendationColor === 'amber', 'Result color is amber');

  // 6. Test Backend HTTP Endpoint
  console.log('\n--- TEST GROUP 6: Backend HTTP Endpoint Route Verification ---');
  try {
    const res = await axios.post('http://localhost:5000/api/food-quality/analyze', {
      imageUrl: '/ai_food_match.jpg'
    }, {
      validateStatus: () => true
    });

    assert(
      res.status === 200 || res.status === 503,
      `HTTP POST /api/food-quality/analyze returned status ${res.status} (${res.data?.code || 'OK'})`
    );
  } catch (httpErr) {
    assert(false, `HTTP request failed: ${httpErr.message}`);
  }

  console.log('\n====================================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');
  process.exit(failed > 0 ? 1 : 0);
}

runTests();

