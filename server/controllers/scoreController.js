const { getAllEmployees, hasSubmittedOnDate, updateScore, logScoreChange } = require('../models/scoreModel');

// Ye asal function hai jo score check aur update karta hai
const runDailyScoreCheck = async () => {
  console.log('Running daily score check...');

  // Kal ki date nikalo (kyunke hum check kar rahe hain "kal kaam hua tha ya nahi")
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];

  const employees = await getAllEmployees();

  for (const employee of employees) {
    // Agar already blocked hai, to usay skip kar dein (Admin ne manually review karna hai)
    if (employee.status === 'blocked') {
      continue;
    }

    const submitted = await hasSubmittedOnDate(employee.id, yesterdayDate);

    if (!submitted) {
      const oldScore = employee.performance_score;
      let newScore = oldScore - 3;

      // Score 0 se neeche na jaye
      if (newScore < 0) newScore = 0;

      // Status decide karo
      let newStatus = 'active';
      if (newScore <= 30) {
        newStatus = 'blocked';
      } else if (newScore <= 60) {
        newStatus = 'warning';
      }

      await updateScore(employee.id, newScore, newStatus);
      await logScoreChange(employee.id, oldScore, newScore, 'Missed daily work submission', 'system');

      console.log(`${employee.name}: ${oldScore}% -> ${newScore}% (${newStatus})`);
    }
  }

  console.log('Daily score check completed.');
};

// Manual test ke liye API (Thunder Client se turant chalane ke liye)
const testScoreCheck = async (req, res) => {
  try {
    await runDailyScoreCheck();
    res.status(200).json({ message: 'Score check completed. Check server logs and database.' });
  } catch (error) {
    res.status(500).json({ message: 'Error running score check', error: error.message });
  }
};

module.exports = { runDailyScoreCheck, testScoreCheck };