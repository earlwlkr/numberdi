const adjectives = [
  "Swift", "Brave", "Clever", "Mighty", "Lucky",
  "Sneaky", "Bold", "Fierce", "Quick", "Sharp",
  "Cosmic", "Turbo", "Hyper", "Mega", "Ultra",
  "Zippy", "Funky", "Dizzy", "Jazzy", "Snappy",
  "Witty", "Nifty", "Groovy", "Zesty", "Spicy",
];

const nouns = [
  "Panda", "Tiger", "Falcon", "Otter", "Fox",
  "Wolf", "Eagle", "Shark", "Lynx", "Hawk",
  "Ninja", "Pirate", "Wizard", "Knight", "Scout",
  "Comet", "Blaze", "Storm", "Flash", "Bolt",
  "Raven", "Cobra", "Viper", "Phoenix", "Jaguar",
];

export function generateRandomName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}
