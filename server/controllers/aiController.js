const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc Generate personalized study plan
const generateStudyPlan = async (req, res) => {
  try {
    const {
      dsaStats,
      studyStats,
      targetCompanies,
      availableHours,
      targetDate,
    } = req.body;

    const prompt = `
You are an expert placement preparation coach. Based on the following student data, create a detailed personalized weekly study plan.

Student Data:
- DSA Progress: ${JSON.stringify(dsaStats)}
- Study Stats: ${JSON.stringify(studyStats)}
- Target Companies: ${targetCompanies?.join(", ") || "Not specified"}
- Available Hours per Day: ${availableHours || 4}
- Target Date: ${targetDate || "Not specified"}

Create a structured 7-day study plan with:
1. Daily topic breakdown
2. Specific DSA topics to focus on based on weak areas
3. Time allocation for each activity
4. Company-specific preparation tips
5. Key milestones to track progress

Format the response in a clear, structured way with day-wise breakdown.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0].message.content;
    res.json({ plan: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Analyze and summarize interview experience
const analyzeInterviewExperience = async (req, res) => {
  try {
    const { experience } = req.body;

    if (!experience) {
      return res
        .status(400)
        .json({ message: "Please provide interview experience text" });
    }

    const prompt = `
You are an expert interview coach. Analyze the following interview experience and provide a structured summary.

Interview Experience:
${experience}

Provide a structured analysis with the following sections:
1. Company & Role Overview
2. Interview Rounds Breakdown (round name, type, topics covered, difficulty)
3. Key Technical Topics Asked
4. Difficulty Level (Easy/Medium/Hard)
5. Important DSA Problems Mentioned
6. Core Subject Topics (OS, DBMS, CN, OOPs)
7. HR/Behavioral Questions
8. Preparation Tips for Future Candidates
9. Overall Difficulty Rating (1-10)
10. Success Tips

Format it in a clean, structured way that is easy to read and follow.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0].message.content;
    res.json({ summary: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateStudyPlan, analyzeInterviewExperience };
