function similarity(a, b) {
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));

  const common = [...wordsA].filter(x => wordsB.has(x));

  return (common.length / Math.max(wordsA.size, wordsB.size)) * 100;
}

module.exports = function(files) {

  let matches = [];
  let plagiarismFound = false;

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {

      const sim = similarity(files[i], files[j]);

      if (sim > 30) {
        plagiarismFound = true;
        matches.push({
          file1: `File ${i+1}`,
          file2: `File ${j+1}`,
          similarity: sim.toFixed(2) + "%"
        });
      }
    }
  }

  return { plagiarismFound, matches };
};