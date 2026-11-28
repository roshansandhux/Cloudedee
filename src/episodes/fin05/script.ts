// fin05 – "Why Car Payments Are Keeping You Poor" – Finnomics. Finn now speaks with the owner's cloned voice ("My voice").
// Chunk captions, no next-episode tease, ≥10 min.
// Facts (US, 2025–26; checked, maths in python):
// - Average new-car price ≈ $48–50k (Kelley Blue Book ATP). Average new-car monthly payment ≈ $750 (Edmunds);
//   about 1 in 5 new-car buyers pay $1,000+/month (Edmunds). Average used-car payment ≈ $520.
// - Typical APRs: new ≈ 7%, used ≈ 11%, deep-subprime used often 20%+ (Edmunds / Experian).
// - $40,000 at 7%: 48 mo → $958/mo, $5,977 interest; 60 → $792, $7,523; 72 → $682, $9,101; 84 → $604, $10,711.
// - $20,000 used, 72 mo: 11% → $7,409 interest; 21% → $15,332 interest.
// - Depreciation: a new car often loses ~20% in year one and roughly half its value within ~5 years (Carfax/KBB rule of thumb).
// - About 1 in 4 trade-ins carry negative equity (Edmunds), averaging thousands of dollars that often get rolled into the next loan.
// - AAA "Your Driving Costs": owning a new car costs roughly $11–12k a year all-in (payment/depreciation, insurance, fuel, repairs, fees).
// - $750/month invested at 7%/yr (monthly): 10 yrs ≈ $130k; 40 yrs ≈ $1.97M. 7% is an assumption, NOT guaranteed.
// - 20/4/10 rule of thumb: ≥20% down, ≤4-year loan, total car costs ≤10% of gross income ($60k income → ≈$500/month).
import {beat, cue, music, say, sfx, wait} from '../../engine/timeline';

// 1 – Cold open: Tyler's driveway at night, the giant truck
export const sCold = [
  music('tension', {vol: 0.26}),
  wait(0.4),
  say('t501', 'tyler', '[proud, loud] Bro. Look at her. The Beast. Twenty-two-inch rims, heated seats, a screen bigger than my apartment.'),
  say('f501', 'finn', '[impressed] That truck is huge, Tyler. How much was it?', {mood: 'surprised'}),
  say('t502', 'tyler', '[casual] Only a thousand bucks.'),
  say('f502', 'finn', '[confused] Only a thousand? For the whole truck?', {mood: 'confused'}),
  say('t503', 'tyler', '[quieter] A thousand… a month. For seven years.'),
  cue('noodles'),
  sfx('slideDown'),
  say('t504', 'tyler', '[sad, slurping] That’s why I eat ramen on the tailgate. Every night. It has a nice view, though.'),
  say('f503', 'finn', '[to camera, serious] Okay. We need to talk about car payments. Because they might be the sneakiest way people stay broke.', {mood: 'determined'}),
  cue('title'),
  music('theme', {vol: 0.4}),
  sfx('whoosh'),
  beat('titleCard', 3.4),
];

// 2 – Studio intro (neon garage)
export const sIntro = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f504', 'finn', '[friendly, upbeat] Welcome to Finnomics! New garage, new jacket, same broke piggy bank. Yes, the moth is still living in it.', {mood: 'happy'}),
  cue('moth'),
  sfx('squeak'),
  say('f505', 'finn', '[quick aside] Quick reminder: this is not financial advice. I’m just a kid with a whiteboard and a lot of opinions.', {mood: 'smug'}),
  say('f506', 'finn', '[explaining] Today we’re answering one question: why do car payments keep so many people poor? And how do you buy a car without getting trapped?', {mood: 'determined'}),
  cue('stat'),
  sfx('ding', {vol: 0.5}),
  say('f507', 'finn', '[amazed] In the U S, the average new-car payment is around seven hundred fifty dollars a month. And nearly one in five new-car buyers pays more than a thousand.', {mood: 'surprised'}),
  say('f508', 'finn', '[deadpan] That’s not a car payment. That’s a second rent.', {mood: 'neutral'}),
  wait(0.4),
];

// 3 – Trick #1: the monthly payment question (Vinny's showroom)
export const sMonthly = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('v501', 'vinny', '[smooth, salesman] Welcome to Vinny’s Value Motors! Best deals in town. So, my friend… what monthly payment works for you?'),
  say('f509', 'finn', '[whisper to camera] And that’s trick number one. The monthly payment question.', {mood: 'smug'}),
  cue('freeze'),
  sfx('scratch'),
  say('f510', 'finn', '[explaining] If you say three hundred a month, the dealer can hit three hundred. Just by making the loan longer. Or adding stuff you didn’t ask for.', {mood: 'neutral'}),
  say('v502', 'vinny', '[innocent] I’m just trying to help you fit the car into your budget, buddy.'),
  say('v508', 'vinny', '[fast, excited] And for just twelve dollars more a month: rust-proof undercoating, nitrogen in the tires, and a lifetime supply of air fresheners!'),
  say('f561', 'finn', '[deadpan] Twelve dollars a month for six years is over eight hundred dollars. For air fresheners.', {mood: 'confused'}),
  say('f511', 'finn', '[explaining] The number that actually matters is the total price. The out-the-door price, with every fee included. Negotiate that first. Talk about financing later.', {mood: 'determined'}),
  cue('total'),
  sfx('ding', {vol: 0.5}),
  say('v503', 'vinny', '[nervous laugh] Heh. Who taught this kid math?'),
  say('f512', 'finn', '[smug] My grandma.', {mood: 'smug'}),
  sfx('boing'),
  wait(1.2),
];

// 4 – The stretch: longer loans (stretch limo on the highway)
export const sStretch = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f513', 'finn', '[explaining] Let’s say you borrow forty thousand dollars for a car, at seven percent interest.', {mood: 'neutral'}),
  cue('m48'),
  sfx('pop'),
  say('f514', 'finn', '[explaining] Pay it off in four years? About nine hundred fifty-eight dollars a month. Ouch. Total interest: about six thousand dollars.', {mood: 'neutral'}),
  cue('m72'),
  sfx('slideUp'),
  say('f515', 'finn', '[explaining] Stretch it to six years and the payment drops to about six eighty-two. Feels better, right? But the interest grows to over nine thousand.', {mood: 'worried'}),
  cue('m84'),
  sfx('slideUp'),
  say('f516', 'finn', '[shocked] Seven years? Six hundred and four a month… and almost eleven thousand dollars in interest.', {mood: 'surprised', loud: true}),
  say('v504', 'vinny', '[proud] And the limo just keeps getting longer! Isn’t it beautiful?'),
  say('f517', 'finn', '[firm] A lower payment doesn’t mean a cheaper car. It usually means you pay more, for longer. And seven years is a long time to pay for something that’s getting older every day.', {mood: 'determined'}),
  wait(1.2),
];

// 5 – The rate menu: interest by credit (loan drive-thru)
export const sRates = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f518', 'finn', '[explaining] And the interest rate isn’t the same for everyone. Welcome to the loan drive-thru.', {mood: 'happy'}),
  cue('menu'),
  sfx('ding', {vol: 0.5}),
  say('f519', 'finn', '[explaining] Recently, new-car loans have averaged around seven percent. Used cars, around eleven. And with bad credit, rates can go above twenty percent.', {mood: 'neutral'}),
  say('s501', 'swipe', '[smooth, through the speaker] Would you like to supersize your interest rate today?'),
  say('f520', 'finn', '[annoyed] Mister Swipe? You work here now?', {mood: 'angry'}),
  say('s502', 'swipe', '[proud] Part-time. The benefits are amazing. For me.'),
  cue('compare'),
  sfx('drumroll', {vol: 0.4}),
  say('f521', 'finn', '[explaining] On a twenty-thousand-dollar used car over six years, eleven percent costs about seven thousand four hundred in interest. At twenty-one percent? Over fifteen thousand. Almost the price of a second car.', {mood: 'surprised'}),
  say('f522', 'finn', '[explaining] Pro tip: get pre-approved at a bank or credit union before you shop. Then the dealer has to beat that rate, not invent one.', {mood: 'determined'}),
  say('f562', 'finn', '[explaining] And your credit score is the key to a better rate. Pay bills on time, keep card balances low, and your next car loan could cost you thousands less.', {mood: 'happy'}),
  wait(1.2),
];

// 6 – The depreciation gremlin (driving off the lot)
export const sGremlin = [
  music('tension', {vol: 0.28}),
  wait(0.3),
  say('f523', 'finn', '[explaining] Now meet the real monster under every new car. Depreciation.', {mood: 'worried'}),
  cue('gremlin'),
  sfx('creak', {vol: 0.5}),
  say('g501', 'gremlin', '[gravelly, gleeful] Hehehe. Shiny new car. Nom nom nom.'),
  say('f524', 'finn', '[explaining] Depreciation means your car loses value over time. A new car often loses around twenty percent in the first year alone.', {mood: 'neutral'}),
  cue('chomp'),
  sfx('bonk'),
  say('f525', 'finn', '[explaining] On a forty-eight-thousand-dollar car, that’s nearly ten thousand dollars gone. Poof. In one year. And after about five years, many cars are worth roughly half what you paid.', {mood: 'surprised'}),
  say('g502', 'gremlin', '[chewing, satisfied] The leather seats are my favorite. Very chewy.'),
  say('f563', 'finn', '[explaining] Used cars lose value too, but usually slower. The gremlin already took the biggest bite before you showed up.', {mood: 'neutral'}),
  say('f526', 'finn', '[explaining] That’s why a car is not an investment. It’s a tool that gets cheaper every year. Your loan, though? Your loan doesn’t care.', {mood: 'determined'}),
  wait(1.2),
];

// 7 – Underwater: negative equity (car literally underwater)
export const sUnderwater = [
  music('tender', {vol: 0.3}),
  wait(0.3),
  say('f527', 'finn', '[explaining, through a snorkel] When you owe more on the car than it’s worth, that’s called being underwater. Or negative equity.', {mood: 'worried'}),
  cue('owe'),
  sfx('splash', {vol: 0.5}),
  say('t505', 'tyler', '[bubbly, underwater] I owe thirty thousand… and the truck is worth twenty-four. Is that bad, bro?'),
  say('f528', 'finn', '[explaining] It means if you sold it today, you’d still owe six thousand dollars. For a truck you don’t have anymore.', {mood: 'neutral'}),
  cue('roll'),
  sfx('slideDown'),
  say('v505', 'vinny', '[cheerful] No problem! We’ll just roll that six thousand into your next loan!'),
  say('f529', 'finn', '[explaining] And that’s how the snowball starts. About one in four trade-ins comes with negative equity. People roll the old debt into the new car, and start the new loan already underwater.', {mood: 'worried'}),
  say('t506', 'tyler', '[gurgling] So I’m paying for… two trucks? And I only have one?'),
  say('f530', 'finn', '[sympathetic] Yeah, buddy. Swim up. We’ll fix this.', {mood: 'sad'}),
  wait(1.2),
];

// 8 – True cost of owning: the gas station at sunset
export const sTrueCost = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f531', 'finn', '[explaining] And the payment is only the beginning. Owning a car comes with a whole crew of bills.', {mood: 'neutral'}),
  cue('gas'),
  sfx('click'),
  say('f532', 'finn', '[counting fast] Gas. Insurance. Oil changes. Tires. Repairs. Registration. Parking. That one random noise that costs eight hundred dollars.', {mood: 'worried'}),
  cue('receipts'),
  sfx('typing', {vol: 0.4}),
  say('f533', 'finn', '[explaining] And if you have a loan, the lender usually requires full coverage insurance. That’s more expensive than basic insurance.', {mood: 'neutral'}),
  say('t512', 'tyler', '[groaning] Bro, my insurance is like three hundred a month. The insurance guy laughed when he saw the truck.'),
  say('f564', 'finn', '[explaining] Yep. Pricier, faster cars usually cost more to insure. The sticker price follows you everywhere.', {mood: 'neutral'}),
  say('f534', 'finn', '[amazed] The AAA estimates owning a new car costs around eleven to twelve thousand dollars a year when you add everything up. That’s close to a thousand a month.', {mood: 'surprised', loud: true}),
  say('t507', 'tyler', '[quietly] I think the truck owns me, bro.'),
  sfx('sadTrombone', {vol: 0.3}),
  wait(1.2),
];

// 9 – The future: what that payment could become (observatory at night)
export const sFuture = [
  music('tender', {vol: 0.3}),
  wait(0.3),
  say('f535', 'finn', '[curious] Here’s the part nobody shows you at the dealership. What else could that seven hundred fifty dollars a month do?', {mood: 'neutral'}),
  cue('scope'),
  sfx('sparkle'),
  say('f536', 'finn', '[explaining] If you invested seven hundred fifty a month instead, and it grew around seven percent a year, after ten years you could have about one hundred thirty thousand dollars.', {mood: 'determined'}),
  cue('forty'),
  sfx('slideUp'),
  say('f537', 'finn', '[amazed] Keep it going for forty years? Close to two million dollars.', {mood: 'surprised', loud: true}),
  say('t508', 'tyler', '[stunned] Two million… I could buy, like, forty trucks.'),
  say('f538', 'finn', '[facepalm] Tyler. No.', {mood: 'confused'}),
  say('f539', 'finn', '[honest] Seven percent isn’t guaranteed. Markets go up and down. But the point is real: a car payment you keep for life can quietly cost you a fortune.', {mood: 'neutral'}),
  say('f540', 'finn', '[explaining] People don’t usually have just one car payment. They pay one off, trade it in, and start a new one. Forever.', {mood: 'worried'}),
  wait(1.2),
];

// 10 – Grandma Ruth's driveway: Old Betsy
export const sRuth = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('u501', 'ruth', '[proud, sweet] Finn, sugar, meet Betsy. Two thousand nine. Bought her used, paid cash, and she still purrs like a kitten.'),
  cue('betsy'),
  sfx('honk'),
  say('f541', 'finn', '[teasing] She purrs like a kitten that smokes, Grandma.', {mood: 'smug'}),
  say('u502', 'ruth', '[unbothered] Here’s my secret. Every month, I still make a car payment. To myself.'),
  cue('jar'),
  sfx('ding', {vol: 0.5}),
  say('f542', 'finn', '[explaining] That’s genius. When your car is paid off, keep sending that same payment into savings. Then when you need a new car, you pay cash. No loan. No interest.', {mood: 'happy'}),
  say('u503', 'ruth', '[sweet, wise] The bank paid me interest instead of me paying the bank. That’s the whole trick, sugar.'),
  say('v506', 'vinny', '[from far away, desperate] Ma’am! Ma’am! We have zero percent financing on a brand-new SUV!'),
  say('u504', 'ruth', '[firm] Betsy can hear you, young man.'),
  sfx('boing'),
  wait(1.2),
];

// 11 – The smart-buyer playbook (driving school with cones)
export const sPlaybook = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f543', 'finn', '[coach] Okay, driving lesson time. Here’s how to buy a car without getting played.', {mood: 'determined'}),
  cue('r1'),
  sfx('pop'),
  say('f544', 'finn', '[explaining] Rule one: the twenty, four, ten rule. Put at least twenty percent down, borrow for four years or less, and keep total car costs under ten percent of your income.', {mood: 'neutral'}),
  say('f545', 'finn', '[explaining] So if you make sixty thousand a year, that’s about five hundred a month. For everything. Payment, insurance, gas. All of it.', {mood: 'neutral'}),
  cue('r2'),
  sfx('pop'),
  say('f546', 'finn', '[explaining] Rule two: consider a reliable used car that’s a few years old. Someone else already fed the depreciation gremlin.', {mood: 'happy'}),
  say('g503', 'gremlin', '[sulking] I’m still hungry, though.'),
  cue('r3'),
  sfx('pop'),
  say('f547', 'finn', '[explaining] Rule three: say no to extras you don’t need. Paint protection, fabric spray, pricey add-ons. Read every line before you sign.', {mood: 'determined'}),
  cue('r4'),
  sfx('pop'),
  say('f548', 'finn', '[explaining] Rule four: be ready to walk away. There are thousands of cars. You only have one bank account.', {mood: 'smug'}),
  wait(1.2),
];

// 12 – Leasing: the carousel
export const sLease = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f549', 'finn', '[explaining] What about leasing? Leasing is basically renting a car for a few years.', {mood: 'neutral'}),
  cue('spin'),
  sfx('whoosh'),
  say('v507', 'vinny', '[sales pitch] Low payments! New car every three years! Round and round we go!'),
  say('f550', 'finn', '[explaining] The payments can look smaller, but at the end you give the car back. You own nothing. And there are mileage limits and fees for wear and tear.', {mood: 'worried'}),
  say('f551', 'finn', '[explaining] For some people, leasing can make sense, like some business owners. But for most of us, a lease that never ends means a payment that never ends.', {mood: 'determined'}),
  say('t509', 'tyler', '[dizzy] I’ve been on this ride for nine years, bro.'),
  sfx('boing'),
  wait(1.2),
];

// 13 – Recap: the car wash of rules
export const sRecap = [
  music('theme', {vol: 0.3}),
  wait(0.3),
  say('f552', 'finn', '[coach] Let’s run it through the car wash. Five rules, squeaky clean.', {mood: 'happy'}),
  cue('w1'),
  sfx('splash', {vol: 0.4}),
  say('f553', 'finn', '[counting] One. Negotiate the total price, not the monthly payment.', {mood: 'neutral'}),
  cue('w2'),
  sfx('splash', {vol: 0.4}),
  say('f554', 'finn', '[counting] Two. Keep the loan short. Four years or less if you can.', {mood: 'neutral'}),
  cue('w3'),
  sfx('splash', {vol: 0.4}),
  say('f555', 'finn', '[counting] Three. Get pre-approved, and protect your credit for a better rate.', {mood: 'neutral'}),
  cue('w4'),
  sfx('splash', {vol: 0.4}),
  say('f556', 'finn', '[counting] Four. Buy reliable, maybe used, and keep it a long time.', {mood: 'neutral'}),
  cue('w5'),
  sfx('splash', {vol: 0.4}),
  say('f557', 'finn', '[counting] Five. When it’s paid off, keep paying yourself.', {mood: 'happy'}),
  cue('shine'),
  sfx('sparkle'),
  say('g504', 'gremlin', '[shrieking] Ahh! Clean finances! It burns!'),
  wait(0.4),
];

// 14 – Outro: Tyler's driveway, morning, the comeback
export const sOutro = [
  music('tender', {vol: 0.32}),
  wait(0.4),
  say('t510', 'tyler', '[proud] Bro, I did it. Sold the Beast, paid off the loan, and bought a used hatchback. Cash.'),
  cue('hatch'),
  sfx('honk'),
  say('f558', 'finn', '[impressed] Tyler! What are you doing with the money you saved?', {mood: 'surprised'}),
  say('t511', 'tyler', '[happy] Five hundred a month goes into investing. Automatically. And I upgraded from ramen… to tacos.'),
  sfx('tada', {vol: 0.4}),
  say('f559', 'finn', '[warm, to camera] A car should get you places. Not keep you stuck. Drive what you can afford, and let your money do the speeding.', {mood: 'happy'}),
  cue('sub'),
  say('f560', 'finn', '[upbeat] If this helped, hit subscribe. It costs zero dollars a month. Zero percent interest. Best deal on the lot.', {mood: 'happy'}),
  sfx('click'),
  say('u505', 'ruth', '[offscreen, proud] Betsy subscribed too, sugar!'),
  sfx('honk'),
  beat('end', 2.6),
];
