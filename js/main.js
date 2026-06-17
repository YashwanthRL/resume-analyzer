// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let extractedResumeText = '';

// Show file name when uploaded
document.getElementById('resume-upload').addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('file-name').textContent = file.name;

  // Extract text from PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }

  extractedResumeText = text;
  console.log('Resume text extracted:', extractedResumeText.slice(0, 200));
});

function analyzeResume() {
  const jobDescription = document.getElementById('job-description').value.trim();

  if (!extractedResumeText) {
    alert('Please upload your resume PDF first!');
    return;
  }

  if (!jobDescription) {
    alert('Please paste a job description!');
    return;
  }

  // Show loading
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');

  // Call analyzer
  analyze(extractedResumeText, jobDescription);
}