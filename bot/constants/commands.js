const COMMANDS = [
    { command: 'start', description: 'Start TonYield App' },
    { command: 'help', description: 'Get avaliable help.' },
    { command: 'language', description: 'Change the bot language.' },
];
  
module.exports = {
    COMMANDS,
    showHelp: () => {
        console.log('Available commands:');
        COMMANDS.forEach((command) => console.log(`- ${command.command}: ${command.description}`));
    },
    changeLanguage: (language) => {
        console.log(`Changed language to ${language}`);
    },
    showHomeMenu: () => {
        console.log('Welcome to the Home Menu!');
    },
    showHelpMenu: () => {
        console.log('Help Menu:');
        COMMANDS.forEach((command) => console.log(`- ${command.command}: ${command.description}`));
    },
    changeLanguageMenu: () => {
        console.log('Change Language Menu:');
        console.log('- English');
        console.log('- Spanish');
        console.log('- French');
    },
}