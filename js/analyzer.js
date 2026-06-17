const API_KEY = 'your-groq-api-key-here';

async function analyze(resumeText, jobDescription) {
  const prompt = `
You are an expert resume analyzer. Analyze the following resume against the job description and respond ONLY in this exact JSON format, nothing else, no markdown, no backticks:

{
  "score": <number between 0 and 100>,
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      }
    );

    const data = await response.json();
    console.log('API response:', JSON.stringify(data));

    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    displayResults(result);

  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Check the console for details.');
    document.getElementById('loading').classList.add('hidden');
  }
}

function displayResults(result) {
  document.getElementById('loading').classList.add('hidden');

  document.getElementById('score-value').textContent = result.score + '%';

  const keywordsList = document.getElementById('keywords-list');
  keywordsList.innerHTML = '';
  result.missingKeywords.forEach(keyword => {
    const li = document.createElement('li');
    li.textContent = keyword;
    keywordsList.appendChild(li);
  });

  const suggestionsList = document.getElementById('suggestions-list');
  suggestionsList.innerHTML = '';
  result.suggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.textContent = suggestion;
    suggestionsList.appendChild(li);
  });

  document.getElementById('results').classList.remove('hidden');
}