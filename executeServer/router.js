const runners = {
  javascript: require("./runners/javascript"),
  python:     require("./runners/python"),
  java:       require("./runners/java"),
  cpp:        require("./runners/cpp"),
  c:          require("./runners/cpp"),   
  go:         require("./runners/go"),
};

const execute = async (language, code) => {
  const runner = runners[language];
  if (!runner) throw new Error(`Unsupported language: ${language}`);
  return runner(code);
};

module.exports = { execute, supportedLanguages: Object.keys(runners) };