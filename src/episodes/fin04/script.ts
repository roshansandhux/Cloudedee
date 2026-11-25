// fin04 – "Why Everything Costs More Now (Inflation Explained by a 14-Year-Old)" – Finnomics, host Finn
// Captions: 'chunks' (small 3–4-word captions, no speech bubbles – owner's request).
// Facts (checked; maths in python):
// - Inflation = general rise in prices; measured with a "basket" of goods & services (CPI): US Bureau of Labor Statistics,
//   Statistics Canada. Fed and Bank of Canada both target ~2% a year.
// - $100 at 3% inflation for 10 years buys about $74 of today's stuff (100/1.03^10 = 74.4). Rule of 72: 72/3 ≈ 24 years to halve.
// - US CPI 1985 avg 107.6 vs 2025 ≈ 322 → about 3×. 35¢ in 1985 ≈ $1.05 today; many full-size candy bars now ≈ $2.
// - US federal minimum wage: $3.35/h in 1985; $7.25/h since 2009 (BLS / DOL).
// - US CPI inflation peaked at 9.1% (12 months to June 2022), the highest since 1981 (BLS).
// - Zimbabwe issued a 100-trillion-dollar note in 2009; Germany 1923 hyperinflation (prices doubling in days).
// - Shrinkflation: same price, smaller package – compare the unit price (price per gram / ounce).
// - Central banks raise interest rates to cool inflation, cut them to warm the economy.
// - Real vs nominal: a 3% raise with 5% inflation ≈ 2% less buying power (1.03/1.05 − 1 = −1.9%).
// - US stocks (S&P 500) long-run average ≈ 10%/yr before inflation, ≈ 7% after – not guaranteed; I bonds & TIPS (US Treasury)
//   are inflation-linked. Keep the emergency fund in cash / high-interest savings.
import {beat, cue, music, say, sfx, wait} from '../../engine/timeline';

// 1 – Cold open: Doug's corner store
export const sCold = [
  music('curious', {vol: 0.3}),
  wait(0.4),
  say('u401', 'ruth', '[sweet, proud] One candy bar, please. Here’s thirty-five cents, sugar.'),
  cue('coins'),
  sfx('click'),
  say('d401', 'doug', '[grumpy, flat] Lady. That’s two dollars and twenty-nine cents.'),
  say('u402', 'ruth', '[shocked] Two dollars?! I used to buy one AND see a movie with change left over!'),
  say('d402', 'doug', '[grumpy] Ma’am, it’s not 1985.'),
  say('f401', 'finn', '[to camera, excited] Okay. Why does everything cost more every single year? There’s a villain behind this.', {mood: 'determined'}),
  cue('puff'),
  sfx('slideUp'),
  say('i401', 'inflato', '[grand, theatrical] Did someone say… villain? Darling, I prefer “price consultant”!'),
  say('f402', 'finn', '[deadpan] It’s a talking balloon.', {mood: 'confused'}),
  cue('title'),
  music('theme', {vol: 0.4}),
  sfx('whoosh'),
  beat('titleCard', 3.4),
];

// 2 – Studio intro
export const sIntro = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('f403', 'finn', '[friendly] Welcome to Finnomics! I’m Finn, I’m fourteen, and my piggy bank still has a moth living in it.', {mood: 'happy'}),
  say('f404', 'finn', '[quick aside] Not financial advice. I’m fourteen.', {mood: 'smug'}),
  say('f405', 'finn', '[explaining] Today: inflation. Why your money slowly shrinks, even when you don’t spend it. And how to fight back.', {mood: 'determined'}),
  cue('moth'),
  sfx('squeak'),
  say('f406', 'finn', '[worried] Wait. If money shrinks… my moth is losing money too?!', {mood: 'worried'}),
  wait(0.4),
];

// 3 – What is inflation: the balloon factory
export const sWhat = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f407', 'finn', '[explaining] Inflation means prices of stuff go up over time. So the same dollar buys a little less.', {mood: 'neutral'}),
  cue('pump'),
  sfx('slideUp'),
  say('i402', 'inflato', '[proud] Every year I give prices a little puff. Pizza? Puff! Rent? Big puff! Sneakers? PUFF!'),
  say('f408', 'finn', '[explaining] To measure it, the government fills a giant shopping cart. Food, rent, gas, haircuts, phone bills.', {mood: 'neutral'}),
  cue('cart'),
  sfx('pop'),
  say('f409', 'finn', '[explaining] Every month they check how much the whole cart costs. That’s called the Consumer Price Index. The C P I.', {mood: 'determined'}),
  say('i403', 'inflato', '[offended] A cart? I’m an ARTIST.'),
  say('f410', 'finn', '[explaining] If the cart costs three percent more than last year, inflation is three percent.', {mood: 'neutral'}),
  say('i412', 'inflato', '[dramatic whisper] And next year? I puff the cart again. And again. And AGAIN.'),
  wait(0.4),
];

// 4 – Melting ice cream: cash loses value
export const sMelt = [
  music('tender', {vol: 0.3}),
  wait(0.3),
  say('f411', 'finn', '[explaining] Here’s the scary part. Cash just sitting there is like an ice cream cone in the sun.', {mood: 'worried'}),
  cue('melt'),
  sfx('splat', {vol: 0.4}),
  say('f412', 'finn', '[explaining] Hide one hundred dollars under your mattress. With three percent inflation, in ten years it buys only about seventy-four dollars of stuff.', {mood: 'surprised'}),
  say('i404', 'inflato', '[innocent] I didn’t steal it. I just made it… smaller.'),
  cue('rule'),
  sfx('ding', {vol: 0.5}),
  say('f413', 'finn', '[explaining] Quick trick: the Rule of seventy-two. Divide seventy-two by the inflation rate. That’s how many years until prices double.', {mood: 'determined'}),
  say('f414', 'finn', '[explaining] At three percent? About twenty-four years. At two percent? About thirty-six.', {mood: 'neutral'}),
  say('f415', 'finn', '[sad] So yeah. My moth is losing money.', {mood: 'sad'}),
  sfx('sadTrombone', {vol: 0.3}),
  say('f457', 'finn', '[explaining] And a bank account paying half a percent while prices rise three percent? Still melting. Just slower.', {mood: 'worried'}),
  wait(0.3),
];

// 5 – Grandma's 1985 time machine (roller rink)
export const s1985 = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  cue('warp'),
  sfx('zap'),
  say('u403', 'ruth', '[nostalgic] Nineteen eighty-five, sugar. Candy bars, thirty-five cents. Roller skates. Big hair.'),
  say('f416', 'finn', '[explaining] Prices since then are about three times higher overall. So thirty-five cents back then is like a dollar today.', {mood: 'neutral'}),
  cue('wage'),
  sfx('ding', {vol: 0.4}),
  say('u404', 'ruth', '[proud] But I only made three dollars and thirty-five cents an hour!'),
  say('f417', 'finn', '[explaining] Exactly. Prices AND pay both go up. The real question is: does your pay grow faster than prices?', {mood: 'determined'}),
  cue('candy'),
  sfx('boing'),
  say('f418', 'finn', '[suspicious] And candy bars went up even more than average. Which means someone’s been extra puffy.', {mood: 'smug'}),
  say('i405', 'inflato', '[whistling innocently] Hm hm hmm…'),
  wait(0.3),
];

// 6 – Why it happens: lemonade auction in the park
export const sWhy = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f419', 'finn', '[explaining] So why does it happen? Reason one: too much money chasing too few things.', {mood: 'neutral'}),
  cue('kids'),
  sfx('pop'),
  say('f420', 'finn', '[explaining] One lemonade stand. One last cup. Three thirsty kids. Then everyone gets ten extra dollars.', {mood: 'happy'}),
  cue('bid'),
  sfx('drumroll', {vol: 0.4}),
  say('f421', 'finn', '[hyped, auctioneer] One dollar! Five dollars! TEN DOLLARS for one lemonade!', {mood: 'surprised', loud: true}),
  sfx('tada', {vol: 0.3}),
  say('f422', 'finn', '[explaining] More money, same lemonade, higher price. Reason two: costs go up. If lemons and sugar get pricier, the stand charges more.', {mood: 'neutral'}),
  cue('printer'),
  sfx('typing', {vol: 0.4}),
  say('f423', 'finn', '[explaining] And if a country prints way too much money, each dollar is worth less. Like adding water to soup.', {mood: 'determined'}),
  say('i406', 'inflato', '[delighted] Brrrrrr! Ohhh, I love that sound.'),
  wait(0.3),
];

// 7 – 2022 roller coaster
export const sCoaster = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f424', 'finn', '[explaining] Normally inflation is small. But in 2022, things went wild.', {mood: 'neutral'}),
  cue('climb'),
  sfx('creak', {vol: 0.5}),
  say('f425', 'finn', '[screaming, excited] In the U S, inflation hit nine point one percent in June 2022! The highest in about forty years!', {mood: 'scared', loud: true}),
  cue('drop'),
  sfx('whoosh'),
  say('u405', 'ruth', '[cheerful] Wheee! I remember the eighties, sugar! This is nothing!'),
  say('f426', 'finn', '[dizzy] Groceries, gas, rent… everything jumped at once. Grandma is having way too much fun.', {mood: 'confused'}),
  wait(0.4),
];

// 8 – Shrinkflation: grocery aisle
export const sShrink = [
  music('tension', {vol: 0.26}),
  wait(0.3),
  say('f427', 'finn', '[whispering, detective] Now, Inflato has a sneaky cousin. Shrinkflation.', {mood: 'smug'}),
  cue('chips'),
  sfx('pop'),
  say('f428', 'finn', '[explaining] Same price, smaller package. This bag of chips is seventy percent air.', {mood: 'angry'}),
  say('i407', 'inflato', '[smug] It’s premium air, darling.'),
  cue('cereal'),
  sfx('slideDown'),
  say('f429', 'finn', '[explaining] The cereal box got thinner. The candy bar got shorter. The price? Didn’t move.', {mood: 'worried'}),
  cue('unit'),
  sfx('ding', {vol: 0.5}),
  say('f430', 'finn', '[explaining] Pro move: check the unit price on the shelf tag. That’s the price per gram or ounce. It can’t hide.', {mood: 'determined'}),
  say('u406', 'ruth', '[proud] I’ve been checking unit prices since before you were born, sugar.'),
  wait(0.3),
];

// 9 – Hyperinflation museum
export const sHyper = [
  music('tension', {vol: 0.28}),
  wait(0.3),
  say('f431', 'finn', '[explaining] When inflation goes totally out of control, it’s called hyperinflation.', {mood: 'worried'}),
  cue('germany'),
  sfx('creak', {vol: 0.4}),
  say('f432', 'finn', '[explaining] In Germany in 1923, prices doubled every few days. People pushed wheelbarrows full of cash to buy bread.', {mood: 'surprised'}),
  say('f458', 'finn', '[amazed] Some people even burned paper money to stay warm, because it was cheaper than buying firewood.', {mood: 'surprised'}),
  cue('zim'),
  sfx('sting', {vol: 0.4}),
  say('f433', 'finn', '[amazed] And in 2009, Zimbabwe printed a one HUNDRED TRILLION dollar bill. It still couldn’t buy much.', {mood: 'surprised'}),
  say('i408', 'inflato', '[swooning] My heroes.'),
  say('f434', 'finn', '[relieved] Good news: that’s super rare. Most countries try hard to keep inflation small and steady.', {mood: 'happy'}),
  wait(0.3),
];

// 10 – The thermostat: central banks & interest rates
export const sThermo = [
  music('curious', {vol: 0.3}),
  wait(0.3),
  say('f435', 'finn', '[explaining] So who fights Inflato? Central banks. In the U S, that’s the Fed. In Canada, the Bank of Canada.', {mood: 'determined'}),
  say('f436', 'finn', '[explaining] Most aim for about two percent inflation a year. Not zero. A little is normal, like a thermostat set just right.', {mood: 'neutral'}),
  cue('hot'),
  sfx('rumble', {vol: 0.4}),
  say('f437', 'finn', '[explaining] When prices run too hot, they raise interest rates. Borrowing costs more, people spend less, and prices cool down.', {mood: 'neutral'}),
  cue('cold'),
  sfx('swish'),
  say('i409', 'inflato', '[shivering, shrinking] Too… cold… I’m deflating!'),
  say('f438', 'finn', '[explaining] But too cold is bad too. If prices fall, people wait to buy, and businesses struggle. That’s deflation.', {mood: 'worried'}),
  say('f459', 'finn', '[explaining] So when the news says the central bank raised rates, it basically turned down the heat on prices.', {mood: 'neutral'}),
  wait(0.3),
];

// 11 – Real vs nominal: Doug's raise
export const sRaise = [
  music('silly', {vol: 0.3}),
  wait(0.3),
  say('d403', 'doug', '[proud, grumpy] Good news, kid. I gave myself a three percent raise.'),
  say('f439', 'finn', '[explaining] Nice! But if prices went up five percent… you can actually buy about two percent less than last year.', {mood: 'neutral'}),
  cue('shrinkDoug'),
  sfx('slideDown'),
  say('d404', 'doug', '[outraged] I got a raise and I’m POORER?!'),
  say('f440', 'finn', '[explaining] That’s the difference between your pay on paper and your real buying power. Always compare your raise to inflation.', {mood: 'determined'}),
  say('f460', 'finn', '[sly] Which means my allowance should go up with inflation every year. Right, Grandma?', {mood: 'smug'}),
  say('u410', 'ruth', '[sweet, firm] Nice try, sugar.'),
  sfx('boing'),
  cue('swipe'),
  sfx('pop'),
  say('s401', 'swipe', '[smooth] Prices too high? Just put it all on the card!'),
  say('f441', 'finn', '[firm] No! Card interest is way higher than inflation. Prices go up, AND you pay interest. Double ouch.', {mood: 'angry'}),
  sfx('boing'),
  wait(0.3),
];

// 12 – How to fight back: the down escalator
export const sFight = [
  music('chase', {vol: 0.28}),
  wait(0.3),
  say('f442', 'finn', '[explaining] So how do you fight back? Think of inflation as a down escalator. If you stand still, you go down.', {mood: 'determined'}),
  cue('cash'),
  sfx('slideDown'),
  say('f443', 'finn', '[explaining] Step one: keep your emergency fund, but in a high-interest savings account, not under the mattress.', {mood: 'neutral'}),
  say('d405', 'doug', '[grumpy, worried] So I should stop keeping my savings in the cash register?'),
  say('f461', 'finn', '[deadpan] Yes, Doug.', {mood: 'neutral'}),
  cue('invest'),
  sfx('slideUp'),
  say('f444', 'finn', '[explaining] Step two: money you won’t need for many years can be invested. Over long periods, the stock market has usually beaten inflation. Usually. Not every year.', {mood: 'determined'}),
  say('f445', 'finn', '[explaining] In the U S, there are also I bonds and TIPS. Government bonds that grow with inflation.', {mood: 'neutral'}),
  cue('skills'),
  sfx('sparkle'),
  say('f446', 'finn', '[hyped] Step three: grow your income. New skills, a side hustle, asking for a raise. Run up the escalator!', {mood: 'happy', loud: true}),
  say('u407', 'ruth', '[proud] And step four: shop smart. Unit prices, store brands, and wait for sales on the big stuff.'),
  wait(0.3),
];

// 13 – The game plan: bowling scoreboard
export const sPlan = [
  music('theme', {vol: 0.3}),
  wait(0.3),
  say('f447', 'finn', '[coach] Okay, the anti-Inflato game plan.', {mood: 'determined'}),
  cue('p1'),
  sfx('pop'),
  say('f448', 'finn', '[counting] One. Inflation means prices rise, so your cash slowly shrinks.', {mood: 'neutral'}),
  cue('p2'),
  sfx('pop'),
  say('f449', 'finn', '[counting] Two. Keep savings in a high-interest account, not a mattress.', {mood: 'neutral'}),
  cue('p3'),
  sfx('pop'),
  say('f450', 'finn', '[counting] Three. Invest long-term money, so it can grow faster than prices.', {mood: 'neutral'}),
  cue('p4'),
  sfx('pop'),
  say('f451', 'finn', '[counting] Four. Check unit prices to catch shrinkflation.', {mood: 'neutral'}),
  cue('p5'),
  sfx('pop'),
  say('f452', 'finn', '[counting] Five. Grow your income faster than inflation.', {mood: 'happy'}),
  cue('strike'),
  sfx('thud'),
  sfx('tada', {vol: 0.4}),
  say('i410', 'inflato', '[panicking] No no no, you’re learning too fast!'),
  wait(0.3),
];

// 14 – Outro: ice cream stand at sunset
export const sOutro = [
  music('tender', {vol: 0.32}),
  wait(0.4),
  say('f453', 'finn', '[warm] Inflation never fully goes away. But if your money keeps moving, it doesn’t have to melt.', {mood: 'happy'}),
  cue('pin'),
  sfx('pop', {vol: 0.7}),
  say('i411', 'inflato', '[deflating, squeaky] Pssshhh… I’ll be baaack… next year…'),
  say('f462', 'finn', '[explaining] He’s right. A little inflation comes back every year. That’s why the plan matters.', {mood: 'neutral'}),
  sfx('squeak'),
  say('u408', 'ruth', '[sweet] Now buy your grandma a candy bar. Thirty-five cents, sugar.'),
  say('f454', 'finn', '[laughing] Grandma, it’s two twenty-nine!', {mood: 'happy'}),
  cue('sub'),
  say('f455', 'finn', '[upbeat] If this helped, subscribe to Finnomics. It’s free. Which, thanks to inflation, is the best price ever.', {mood: 'happy'}),
  sfx('click'),
  say('f456', 'finn', '[whispering, teasing] Next time: how a teenager can make their first thousand dollars.', {mood: 'smug'}),
  say('u409', 'ruth', '[offscreen, excited] I’ll knit things!'),
  sfx('boing'),
  beat('end', 2.5),
];
