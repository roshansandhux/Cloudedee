// fin03 – "How to Get Rich in Canada (Even If You Start Broke)" – Finnomics, host Finn (Canadian outfit this episode)
// Facts (2026, checked): TFSA dollar limit $7,000 (2024–2026); cumulative room $109,000 if 18+ & resident since 2009 and never
// contributed (CRA/Fidelity/BMO). TFSA withdrawals tax-free, room comes back Jan 1 next year. RRSP: 18% of last year's earned
// income up to $33,810 (2026); deduction now, taxed on withdrawal; deadline Mar 1, 2027 for 2026. FHSA: $8,000/yr, $40,000
// lifetime, deductible in + tax-free out for a qualifying first home. Typical Canadian credit-card purchase rate ≈ 20%
// (19.99–20.99%). Maths (python): $7,000/yr for 40 yrs @7% ≈ $1,397,000 (contributed $280k); 30 yrs ≈ $661,000 ($210k).
// $100k for 30 yrs @7%: 2% fee → ≈$432k, 0.25% fee → ≈$710k. 7% is an assumption, not a promise.
import {beat, cue, music, say, sfx, wait} from '../../engine/timeline';

// 1 – Cold open: snowy street, the moose
export const sCold = [
  music('curious', {vol: 0.3}),
  wait(0.5),
  say('f101', 'finn', '[cheerful, proud] Canada. Free healthcare. Maple syrup. Moose crossing the road like they pay rent.', {mood: 'happy'}),
  cue('moose'),
  sfx('thud'),
  say('m101', 'moose', '[deep, slow, dead serious] I do not pay rent. I collect it.'),
  say('f102', 'finn', '[startled] Okay, that moose is terrifying.', {mood: 'scared'}),
  say('f103', 'finn', '[excited, to camera] But here’s the thing. Canada also gives you three money cheat codes. And most people never press the buttons.', {mood: 'determined'}),
  cue('hook'),
  sfx('sting', {vol: 0.5}),
  say('f104', 'finn', '[hyped] Use them right, and a regular person could retire a millionaire. Seriously.', {mood: 'surprised'}),
  cue('title'),
  music('theme', {vol: 0.4}),
  sfx('whoosh'),
  beat('titleCard', 3.4),
];

// 2 – Studio intro (red & white)
export const sIntro = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f105', 'finn', '[friendly] Welcome to Finnomics! I’m Finn, I’m fourteen, and yes, this toque is new. My piggy bank is still a moth hotel.', {mood: 'happy'}),
  say('f106', 'finn', '[quick aside] Not financial advice. I’m fourteen. And very cold.', {mood: 'smug'}),
  wait(0.2),
  say('f107', 'finn', '[explaining] So, the three cheat codes. The T F S A. The R R S P. And the F H S A.', {mood: 'neutral'}),
  cue('codes'),
  sfx('pop'),
  say('f108', 'finn', '[playful] They sound like Wi-Fi passwords. But they are basically shields that block the Tax Moose.', {mood: 'smug'}),
  cue('mooseShadow'),
  sfx('rumble', {vol: 0.4}),
  say('m102', 'moose', '[deep, offended] I heard that.'),
  wait(0.4),
];

// 3 – TFSA: ice fishing with Grandma
export const sTfsa = [
  music('tender', {vol: 0.3}),
  wait(0.4),
  say('f109', 'finn', '[explaining] Cheat code number one. The Tax-Free Savings Account. Grandma explains it best.', {mood: 'happy'}),
  say('u101', 'ruth', '[sweet, southern] Every fish you catch through this hole, you keep. All of it. No moose gets a bite.'),
  cue('catch'),
  sfx('splash'),
  say('f110', 'finn', '[explaining] Money you put in a TFSA can grow, and when you take it out, you pay zero tax on the growth. Zero!', {mood: 'surprised'}),
  cue('limit'),
  sfx('ding', {vol: 0.5}),
  say('f111', 'finn', '[explaining] For 2026, you can add seven thousand dollars. And unused room piles up. If you’ve been an adult since 2009 and never used it, you could have a hundred and nine thousand dollars of room!', {mood: 'determined'}),
  cue('mooseTry'),
  sfx('boing'),
  say('m103', 'moose', '[deep, frustrated] Why is there a force field around this hole?'),
  say('u102', 'ruth', '[proud] Because it’s a TFSA, honey. Shoo.'),
  wait(0.3),
  say('f112', 'finn', '[explaining] And if you take money out, you get that room back next year. It’s flexible. Like a hockey player. Or Grandma.', {mood: 'happy'}),
];

// 4 – The garage: TFSA is a basket, not a bank account
export const sGarage = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f113', 'finn', '[proud] So I opened a TFSA! And I put my money in it! And it earned... half a percent.', {mood: 'happy'}),
  cue('sad'),
  sfx('sadTrombone', {vol: 0.4}),
  say('u103', 'ruth', '[gentle, teasing] Sugar, you bought a race car and left it in the garage.'),
  say('f114', 'finn', '[realising] The biggest TFSA mistake. It’s not a savings account. It’s a basket. You choose what goes inside.', {mood: 'surprised'}),
  cue('basket'),
  sfx('pop'),
  say('f115', 'finn', '[explaining] Cash, sure. But many long-term investors fill it with low-cost index funds. Tiny pieces of hundreds of companies, all in one bucket.', {mood: 'neutral'}),
  cue('vroom'),
  sfx('whoosh'),
  say('f116', 'finn', '[hyped] Now the race car is actually racing!', {mood: 'happy', loud: true}),
  say('u106', 'ruth', '[wise] And don’t put all your eggs in one basket, sugar. Unless the basket holds a thousand companies.'),
  say('f151', 'finn', '[explaining] That’s the magic. One index fund can own pieces of thousands of companies. If one company flops, you barely notice.', {mood: 'neutral'}),
  cue('spread'),
  sfx('sparkle'),
  say('f152', 'finn', '[playful] It’s like a poutine. If one fry is soggy, the poutine still slaps.', {mood: 'smug'}),
  wait(0.4),
];

// 4a – Two TFSA traps: the curling rink
export const sTraps = [
  music('tension', {vol: 0.26}),
  wait(0.3),
  say('f161', 'finn', '[serious] Two TFSA traps. Trap one: putting in too much. The CRA charges one percent per month on the extra.', {mood: 'worried'}),
  cue('penalty'),
  sfx('sting', {vol: 0.4}),
  say('m107', 'moose', '[deep, delighted] One percent. Every. Month.'),
  say('f162', 'finn', '[explaining] Your room shows in your CRA account, but it can lag behind. So keep your own records too.', {mood: 'neutral'}),
  cue('casino'),
  sfx('drumroll', {vol: 0.4}),
  say('f163', 'finn', '[explaining] Trap two: treating your TFSA like a casino. If you day-trade a lot inside it, the CRA can decide it’s a business, and tax it.', {mood: 'determined'}),
  say('u109', 'ruth', '[calm] Slow and steady, sugar. Like curling.'),
  say('f164', 'finn', '[confused] Grandma, curling is literally sweeping ice really fast.', {mood: 'confused'}),
  say('u110', 'ruth', '[dry] Hush.'),
  sfx('boing'),
  wait(0.4),
];

// 4b – Emergency fund: Grandma's cottage dock
export const sEmergency = [
  music('tender', {vol: 0.3}),
  wait(0.3),
  say('f153', 'finn', '[explaining] Before we invest a single loonie, we need a snow shovel. An emergency fund.', {mood: 'determined'}),
  cue('storm'),
  sfx('rumble', {vol: 0.5}),
  say('u107', 'ruth', '[calm] Life always sends a snowstorm, sugar. The car breaks. The furnace quits. The dog eats a mitten.'),
  say('f154', 'finn', '[explaining] Without savings, that surprise goes on a credit card at around twenty percent interest. Ouch.', {mood: 'worried'}),
  cue('jar'),
  sfx('ding', {vol: 0.5}),
  say('f155', 'finn', '[explaining] A common goal is three to six months of your basic expenses, kept somewhere safe and easy to reach. Start small. Even five hundred dollars helps.', {mood: 'neutral'}),
  say('u108', 'ruth', '[proud] Mine’s in a high-interest savings account. And a little in a coffee can. Old habits.'),
  sfx('boing'),
  wait(0.3),
];

// 5 – RRSP: hockey rink
export const sRrsp = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f117', 'finn', '[sporty announcer] Cheat code number two! The Registered Retirement Savings Plan!', {mood: 'determined', loud: true}),
  say('f118', 'finn', '[explaining] Here’s the trick. Money you put in lowers your taxable income today. So the government can send you a refund.', {mood: 'neutral'}),
  cue('refund'),
  sfx('ding', {vol: 0.5}),
  say('f119', 'finn', '[explaining] Put in a thousand dollars, and depending on your tax bracket, you might get a few hundred back. Like scoring a goal and getting the puck returned with a bonus.', {mood: 'happy'}),
  cue('goal'),
  sfx('tada', {vol: 0.4}),
  say('m104', 'moose', '[deep, patient, menacing] Enjoy it. I will be waiting at retirement.'),
  say('f120', 'finn', '[explaining] He’s right. RRSP money gets taxed when you take it out. The hope is you’re in a lower tax bracket when you’re retired.', {mood: 'worried'}),
  say('f121', 'finn', '[explaining] Your room is eighteen percent of last year’s income, up to thirty-three thousand eight hundred and ten dollars for 2026.', {mood: 'neutral'}),
  cue('assist'),
  sfx('whoosh'),
  say('f122', 'finn', '[excited] And if your job matches your RRSP contributions? That’s free money. That’s an assist. Never skip an assist!', {mood: 'happy', loud: true}),
  wait(0.3),
];

// 6 – FHSA: house-hunting street
export const sFhsa = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f123', 'finn', '[explaining] Cheat code number three is for future home buyers. The First Home Savings Account.', {mood: 'neutral'}),
  say('f124', 'finn', '[explaining] It’s like the TFSA and the RRSP had a baby. Money going in can lower your taxes, and money coming out for your first home is tax-free.', {mood: 'happy'}),
  cue('baby'),
  sfx('pop'),
  say('m105', 'moose', '[deep, horrified] Tax-free on the way in AND the way out? That is illegal.'),
  say('f125', 'finn', '[smug] It’s literally the law, buddy.', {mood: 'smug'}),
  wait(0.2),
  say('f126', 'finn', '[explaining] You can add eight thousand dollars a year, up to forty thousand total. If you might buy a home one day, look into it early.', {mood: 'determined'}),
  cue('house'),
  sfx('ding', {vol: 0.4}),
  say('f127', 'finn', '[deflated] Forty thousand won’t buy a house in Toronto. But it might buy the front door.', {mood: 'sad'}),
  sfx('sadTrombone', {vol: 0.3}),
  wait(0.3),
];

// 7 – Bernie the Beaver: compounding & starting early
export const sBeaver = [
  music('tender', {vol: 0.3}),
  wait(0.3),
  say('f128', 'finn', '[curious] But how does a normal person get to a million? I asked the hardest-working guy in Canada.', {mood: 'confused'}),
  say('b101', 'bernie', '[cheerful, fast] One stick a day, bud. Every day. That’s how you build a dam!'),
  cue('dam'),
  sfx('knock', {vol: 0.4}),
  say('f129', 'finn', '[explaining] That’s compounding. Your money earns money, then that money earns money too. Boring at first, then huge.', {mood: 'neutral'}),
  cue('race'),
  sfx('slideUp'),
  say('f130', 'finn', '[explaining] Say you invest seven thousand a year in your TFSA from age twenty-five to sixty-five, and it grows seven percent a year. You’d put in two hundred eighty thousand.', {mood: 'determined'}),
  cue('million'),
  sfx('tada', {vol: 0.5}),
  say('f131', 'finn', '[amazed] And end up with about one point four million dollars. Tax-free!', {mood: 'surprised', loud: true}),
  cue('late'),
  sfx('slideDown'),
  say('f132', 'finn', '[serious] Start ten years later, at thirty-five? About six hundred sixty thousand. Less than half!', {mood: 'worried'}),
  say('b102', 'bernie', '[wise, chill] Ya can’t build a dam in the last week of summer, eh.'),
  say('f133', 'finn', '[quick] Seven percent isn’t guaranteed, by the way. Some years go up, some go down. But time is your best friend.', {mood: 'neutral'}),
  say('f156', 'finn', '[encouraging] Can’t do seven thousand a year? Nobody starts there. Even a hundred dollars a month for forty years, at seven percent, could grow to around two hundred sixty thousand.', {mood: 'happy'}),
  cue('small'),
  sfx('sparkle'),
  say('b104', 'bernie', '[cheerful] Small sticks still make a dam, bud!'),
  wait(0.3),
];

// 8 – Sugar shack: fees are a leak
export const sFees = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f134', 'finn', '[explaining] Now, the sneaky leak. Fees.', {mood: 'determined'}),
  cue('drip'),
  sfx('splat', {vol: 0.4}),
  say('f135', 'finn', '[explaining] Some investment funds charge around two percent a year. Low-cost index funds can charge a quarter of a percent or less.', {mood: 'neutral'}),
  say('f136', 'finn', '[explaining] Two percent sounds tiny. But on a hundred thousand dollars over thirty years, it could cost you more than two hundred and fifty thousand dollars!', {mood: 'surprised', loud: true}),
  cue('bucket'),
  sfx('splash', {vol: 0.5}),
  say('b103', 'bernie', '[shocked] That’s a lot of syrup, bud!'),
  say('f137', 'finn', '[firm] Always check the fee. It’s called the M E R. Lower is usually better.', {mood: 'determined'}),
  wait(0.3),
];

// 9 – Mr. Swipe's cameo: kill high-interest debt first
export const sDebt = [
  music('tension', {vol: 0.28}),
  wait(0.3),
  say('s101', 'swipe', '[smooth, sneaky] Psst. Why invest when you could buy a snowmobile on credit?'),
  say('f138', 'finn', '[annoyed] Mister Swipe! What are you doing in Canada?', {mood: 'angry'}),
  say('s102', 'swipe', '[proud] Card interest here is around twenty percent. I LOVE it here.'),
  say('f139', 'finn', '[explaining] And that’s the point. If your card charges twenty percent and your investments might earn seven, pay off the card first. That’s a guaranteed win.', {mood: 'determined'}),
  cue('freeze'),
  sfx('zap'),
  say('s103', 'swipe', '[shivering, chattering] I’m f-f-freezing. I’m going back to the mall.'),
  wait(0.4),
];

// 9b – Automate it: the robot Zamboni
export const sAuto = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f157', 'finn', '[explaining] Here’s the laziest trick that works. Automate it.', {mood: 'smug'}),
  cue('robot'),
  sfx('zap', {vol: 0.4}),
  say('f158', 'finn', '[explaining] Set an automatic transfer for payday. The money moves into your TFSA before you even see it.', {mood: 'neutral'}),
  say('f159', 'finn', '[playful] It’s called paying yourself first. You can’t spend money that already left the building.', {mood: 'happy'}),
  cue('mall'),
  sfx('swish'),
  say('s104', 'swipe', '[distant, outraged] Hey! I was going to spend that!'),
  say('f160', 'finn', '[explaining] Then every time you get a raise, bump the transfer up a little. Future you will send a thank-you card.', {mood: 'determined'}),
  cue('card'),
  sfx('ding', {vol: 0.4}),
  say('b105', 'bernie', '[cheerful] Robots building dams? I love it, eh!'),
  wait(0.3),
];

// 10 – The game plan: hockey scoreboard
export const sPlan = [
  music('theme', {vol: 0.3}),
  wait(0.3),
  say('f140', 'finn', '[coach voice] Okay team, here’s the game plan. A common order lots of people use.', {mood: 'determined'}),
  cue('p1'),
  sfx('pop'),
  say('f141', 'finn', '[counting] One. Build a small emergency fund, so surprises don’t go on a credit card.', {mood: 'neutral'}),
  cue('p2'),
  sfx('pop'),
  say('f142', 'finn', '[counting] Two. Pay off high-interest debt.', {mood: 'neutral'}),
  cue('p3'),
  sfx('pop'),
  say('f143', 'finn', '[counting] Three. Grab any employer match. Never skip an assist.', {mood: 'happy'}),
  cue('p4'),
  sfx('pop'),
  say('f144', 'finn', '[counting] Four. Fill your TFSA, and your FHSA if you want a first home.', {mood: 'neutral'}),
  cue('p5'),
  sfx('pop'),
  say('f145', 'finn', '[counting] Five. Use your RRSP, especially as your income grows.', {mood: 'neutral'}),
  cue('p6'),
  sfx('pop'),
  say('f146', 'finn', '[counting] Six. Pick low-fee investments, automate it, and let time do the work.', {mood: 'determined'}),
  say('u104', 'ruth', '[cheering] And never feed the moose more than you have to!'),
  wait(0.4),
];

// 11 – Outro: frozen lake at sunset
export const sOutro = [
  music('tender', {vol: 0.32}),
  wait(0.4),
  say('f147', 'finn', '[warm, sincere] Getting rich in Canada isn’t about one big win. It’s one stick a day. Use the cheat codes, keep fees low, and start early.', {mood: 'happy'}),
  say('m106', 'moose', '[deep, sad] So I get nothing?'),
  say('f148', 'finn', '[kind] You still get some. Just less. Now go eat a pine cone.', {mood: 'smug'}),
  sfx('boing'),
  cue('sub'),
  say('f149', 'finn', '[upbeat] If this helped, subscribe to Finnomics. It’s free. Even the moose subscribed.', {mood: 'happy'}),
  sfx('click'),
  say('f150', 'finn', '[whispering, teasing] Next time: inflation. Why a candy bar costs way more than it did for Grandma.', {mood: 'smug'}),
  say('u105', 'ruth', '[offscreen, proud] Thirty-five cents, sugar!'),
  sfx('boing'),
  beat('end', 2.5),
];
