type Player = {
    name: string;
    skill: number; // 1-100
    luck: number;  // 1-100
}



const generate20kPlayers = (): Player[] => {
    // generate 20,000 players with random skill and luck, and incremental names
    const players: Player[] = [];
    for (let i = 1; i <= 20000; i++) {
        players.push({ name: `Player ${i}`, skill: Math.round(Math.random() * 100), luck: Math.round(Math.random() * 100) });
    }
    return players;
}

const find10Winners = (players: Player[]): Player[] => {
    // Compute weighted score (95% skill, 5% luck) for each player,
    // then return the top 10 players by that score.
    if (!players || players.length === 0) return [];

    // Map players to objects that include the computed score.
    const scored = players.map(p => ({
        player: p,
        score: (p.skill * 0.95) + (p.luck * 0.05)
    }));

    // Sort descending by score.
    scored.sort((a, b) => b.score - a.score);

    // Take top 10 (or fewer if not enough players) and return the players only.
    const top = scored.slice(0, 10).map(s => s.player);
    return top;
}

const findAverageLuckOfWinners = (winners: Player[]): number => {
    if (!winners || winners.length === 0) return 0;
    const totalLuck = winners.reduce((sum, player) => sum + player.luck, 0);
    return totalLuck / winners.length;
}

const findAverageSkillOfWinners = (winners: Player[]): number => {
    if (!winners || winners.length === 0) return 0;
    const totalSkill = winners.reduce((sum, player) => sum + player.skill, 0);
    return totalSkill / winners.length;
}

import cliProgress from 'cli-progress';

const runOneRoundAndFindAverageLuckAndSkill = (): { averageLuck: number; averageSkill: number } => {
    const players = generate20kPlayers();
    const winners = find10Winners(players);
    return {averageLuck: findAverageLuckOfWinners(winners), averageSkill: findAverageSkillOfWinners(winners)};
}

let totalAverageLuck = 0;
let totalAverageSkill = 0;
const rounds = 1000;

// Create a new progress bar instance
const bar = new cliProgress.SingleBar({
    format: 'Simulations |{bar}| {percentage}% || {value}/{total} rounds || avgLuck: {avgLuck}',
    hideCursor: true
});

bar.start(rounds, 0, { avgLuck: 'N/A' });

for (let i = 0; i < rounds; i++) {
    const { averageLuck, averageSkill } = runOneRoundAndFindAverageLuckAndSkill();
    totalAverageLuck += averageLuck;
    totalAverageSkill += averageSkill;
    const currentAvgLuck = Math.round(totalAverageLuck / (i + 1));
    const currentAvgSkill = Math.round(totalAverageSkill / (i + 1));
    // update progress bar with payload
    bar.update(i + 1, { avgLuck: currentAvgLuck.toString(), avgSkill: currentAvgSkill.toString() });
}

bar.stop();

const overallAverageLuck = Math.round(totalAverageLuck / rounds);
const overallAverageSkill = Math.round(totalAverageSkill / rounds);

console.log("After %d simulations of 20,000 players each, average luck of top 10 winners:", rounds);
console.log(overallAverageLuck);
console.log("After %d simulations of 20,000 players each, average skill of top 10 winners:", rounds);
console.log(overallAverageSkill);

export {}