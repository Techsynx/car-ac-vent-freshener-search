/**
 * Benchmark Evaluation Script for Car AC Vent Air Freshener AI Pipeline
 * Evaluates the 10 Genuine + 10 Fake/Spam/Non-Vent ground truth dataset.
 * Runs Question 1 (Vent Check) and Question 2 (Genuineness Check).
 */

import { GROUND_TRUTH_DATASET } from '../src/lib/dataset.js';
import { evaluateIsVentFreshener, evaluateGenuineness } from '../src/lib/aiService.js';

async function runEvaluation() {
  console.log('================================================================');
  console.log('  CAR AC VENT AIR FRESHENER - AI PIPELINE BENCHMARK (10+10 DATASET)');
  console.log('================================================================\n');

  let catCorrect = 0;
  let catTotal = GROUND_TRUTH_DATASET.length;

  let genuineCorrect = 0;
  let genuineTotal = GROUND_TRUTH_DATASET.length;

  console.log('--- EVALUATING 20 GROUND TRUTH SAMPLES ---\n');

  for (let i = 0; i < GROUND_TRUTH_DATASET.length; i++) {
    const item = GROUND_TRUTH_DATASET[i];
    const catResult = await evaluateIsVentFreshener(item.name, item.description);
    const trustResult = await evaluateGenuineness(item);

    const isCatMatch = catResult.is_vent_freshener === item.expected_is_vent;
    if (isCatMatch) catCorrect++;

    const isTrustMatch = trustResult.is_genuine === item.expected_genuine;
    if (isTrustMatch) genuineCorrect++;

    const prefix = item.expected_is_vent && item.expected_genuine ? '[GENUINE VENT]' : '[NEGATIVE/SPAM]';
    const catIcon = isCatMatch ? '✅' : '❌';
    const trustIcon = isTrustMatch ? '✅' : '❌';

    console.log(`${i + 1}. ${prefix} ${item.name.substring(0, 50)}...`);
    console.log(`   Q1 (Vent Freshener?): Expected=${item.expected_is_vent}, Predicted=${catResult.is_vent_freshener} (Conf: ${catResult.confidence}%) ${catIcon}`);
    console.log(`   Q2 (Genuine?):        Expected=${item.expected_genuine}, Predicted=${trustResult.is_genuine} (Score: ${trustResult.genuine_score}/100) ${trustIcon}`);
    console.log(`   AI Reason:            ${trustResult.genuine_reason}`);
    console.log('----------------------------------------------------------------');
  }

  const catAccuracy = ((catCorrect / catTotal) * 100).toFixed(1);
  const trustAccuracy = ((genuineCorrect / genuineTotal) * 100).toFixed(1);
  const overallAccuracy = (((catCorrect + genuineCorrect) / (catTotal + genuineTotal)) * 100).toFixed(1);

  console.log('\n================================================================');
  console.log('                     EVALUATION SUMMARY                         ');
  console.log('================================================================');
  console.log(`Total Ground Truth Products Evaluated : ${catTotal} (10 Genuine, 10 Negative/Spam)`);
  console.log(`Question 1 (Vent Category Filter) Acc : ${catAccuracy}% (${catCorrect}/${catTotal} correct)`);
  console.log(`Question 2 (Genuineness Scorer) Acc   : ${trustAccuracy}% (${genuineCorrect}/${genuineTotal} correct)`);
  console.log(`Overall AI Pipeline Accuracy          : ${overallAccuracy}%`);
  console.log('================================================================\n');

  if (overallAccuracy >= 90) {
    console.log('🎯 RESULT: PASSED! AI pipeline meets high precision & reliability criteria.\n');
  } else {
    console.log('⚠️ RESULT: Needs fine-tuning.\n');
  }
}

runEvaluation().catch(err => {
  console.error('Evaluation failed:', err);
  process.exit(1);
});
