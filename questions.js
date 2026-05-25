// USCIS 100 Civics Questions (2008 version, the standard test).
// v1.5 schema: each question lists ALL accepted answers per USCIS + a pool of distractors.
// At render time the game rotates which accepted answer becomes the "correct" multiple-choice option.
// For "name two/three" questions, `requires` says how many atomic answers are needed.
// State-specific answers = Washington State. Current officials = May 2026.

const QUESTIONS = [
  { n: 1, q: "What is the supreme law of the land?",
    accepted: ["the Constitution"],
    distractors: ["the Bill of Rights", "the Declaration of Independence", "the Articles of Confederation", "the Federalist Papers"] },

  { n: 2, q: "What does the Constitution do?",
    accepted: ["sets up the government", "defines the government", "protects basic rights of Americans"],
    distractors: ["lists the 50 states", "declares independence from Britain", "establishes the national anthem", "abolishes slavery"] },

  { n: 3, q: "The idea of self-government is in the first three words of the Constitution. What are these words?",
    accepted: ["We the People"],
    distractors: ["Four score and...", "I have a dream", "Life, liberty, and...", "When in the course..."] },

  { n: 4, q: "What is an amendment?",
    accepted: ["a change to the Constitution", "an addition to the Constitution"],
    distractors: ["a Supreme Court ruling", "a presidential order", "a new state added to the Union", "a federal regulation"] },

  { n: 5, q: "What do we call the first ten amendments to the Constitution?",
    accepted: ["the Bill of Rights"],
    distractors: ["the Federalist Papers", "the Articles of Confederation", "the Emancipation Proclamation", "the Declaration of Independence"] },

  { n: 6, q: "What is one right or freedom from the First Amendment?",
    accepted: ["speech", "religion", "assembly", "press", "petition the government"],
    distractors: ["the right to vote", "the right to bear arms", "the right to a fair trial", "the right to own property", "free public education", "the right to privacy"] },

  { n: 7, q: "How many amendments does the Constitution have?",
    accepted: ["twenty-seven (27)"],
    distractors: ["ten (10)", "seventeen (17)", "fifty (50)", "thirteen (13)"] },

  { n: 8, q: "What did the Declaration of Independence do?",
    accepted: ["announced our independence from Great Britain", "declared our independence from Great Britain", "said that the United States is free from Great Britain"],
    distractors: ["established the three branches of government", "ended slavery", "created the U.S. dollar", "founded the Supreme Court"] },

  { n: 9, q: "What are two rights in the Declaration of Independence?",
    accepted: ["life", "liberty", "pursuit of happiness"],
    distractors: ["speech", "religion", "voting", "assembly", "bear arms", "a fair trial", "education", "due process"],
    requires: 2 },

  { n: 10, q: "What is freedom of religion?",
    accepted: ["You can practice any religion, or not practice a religion."],
    distractors: ["You must follow the religion of your state.", "The government chooses the official religion.", "Only Christians can vote.", "You must attend a service every week."] },

  { n: 11, q: "What is the economic system in the United States?",
    accepted: ["capitalist economy", "market economy"],
    distractors: ["communist economy", "socialist economy", "monarchy", "feudalism"] },

  { n: 12, q: "What is the \"rule of law\"?",
    accepted: ["Everyone must follow the law.", "Leaders must obey the law.", "Government must obey the law.", "No one is above the law."],
    distractors: ["The President writes all laws.", "The law applies only to citizens.", "Only judges follow the law.", "The Constitution is optional."] },

  { n: 13, q: "Name one branch or part of the government.",
    accepted: ["Congress", "legislative", "President", "executive", "the courts", "judicial"],
    distractors: ["the Cabinet", "the military", "the Federal Reserve", "the states", "the press", "the United Nations"] },

  { n: 14, q: "What stops one branch of government from becoming too powerful?",
    accepted: ["checks and balances", "separation of powers"],
    distractors: ["the Bill of Rights", "the Pledge of Allegiance", "term limits only", "the Federal Reserve", "the military"] },

  { n: 15, q: "Who is in charge of the executive branch?",
    accepted: ["the President"],
    distractors: ["the Speaker of the House", "the Chief Justice", "the Vice President", "the Secretary of State"] },

  { n: 16, q: "Who makes federal laws?",
    accepted: ["Congress", "Senate and House of Representatives", "U.S. legislature", "national legislature"],
    distractors: ["the President", "the Supreme Court", "the states", "the Cabinet"] },

  { n: 17, q: "What are the two parts of the U.S. Congress?",
    accepted: ["the Senate and House of Representatives"],
    distractors: ["the House and the Cabinet", "the Senate and the Supreme Court", "the President and the Vice President", "the House and the President"] },

  { n: 18, q: "How many U.S. Senators are there?",
    accepted: ["one hundred (100)"],
    distractors: ["fifty (50)", "four hundred thirty-five (435)", "five hundred thirty-eight (538)", "two hundred (200)"] },

  { n: 19, q: "We elect a U.S. Senator for how many years?",
    accepted: ["six (6)"],
    distractors: ["two (2)", "four (4)", "eight (8)", "ten (10)"] },

  { n: 20, q: "Who is one of your state's U.S. Senators now? (Washington State)",
    accepted: ["Patty Murray", "Maria Cantwell"],
    distractors: ["Pramila Jayapal", "Bob Ferguson", "Suzan DelBene", "Jay Inslee", "Christine Gregoire", "Adam Smith"],
    note: "Washington's senators are Patty Murray and Maria Cantwell." },

  { n: 21, q: "The House of Representatives has how many voting members?",
    accepted: ["four hundred thirty-five (435)"],
    distractors: ["one hundred (100)", "two hundred fifty (250)", "five hundred thirty-eight (538)", "three hundred (300)"] },

  { n: 22, q: "We elect a U.S. Representative for how many years?",
    accepted: ["two (2)"],
    distractors: ["four (4)", "six (6)", "eight (8)", "one (1)"] },

  // Q23 (your specific U.S. Representative) is skipped — depends on House district.
  // On test day name your actual district's rep. Find yours at house.gov/representatives/find-your-representative.

  { n: 24, q: "Who does a U.S. Senator represent?",
    accepted: ["all people of the state"],
    distractors: ["only voters who voted for them", "people in their political party", "business owners", "only U.S. citizens in the state"] },

  { n: 25, q: "Why do some states have more Representatives than other states?",
    accepted: ["because of the state's population", "they have more people", "some states have more people"],
    distractors: ["bigger geographic area", "older states have more", "the state's wealth", "the number of cities in the state"] },

  { n: 26, q: "We elect a President for how many years?",
    accepted: ["four (4)"],
    distractors: ["two (2)", "six (6)", "eight (8)", "one (1)"] },

  { n: 27, q: "In what month do we vote for President?",
    accepted: ["November"],
    distractors: ["October", "January", "July", "September"] },

  { n: 28, q: "What is the name of the President of the United States now?",
    accepted: ["Donald Trump", "Trump"],
    distractors: ["Joe Biden", "Kamala Harris", "JD Vance", "Barack Obama", "Mike Pence"],
    note: "As of May 2026. Trump's second term began January 20, 2025." },

  { n: 29, q: "What is the name of the Vice President of the United States now?",
    accepted: ["JD Vance", "Vance", "J.D. Vance"],
    distractors: ["Kamala Harris", "Mike Pence", "Tim Walz", "Joe Biden", "Mike Johnson"],
    note: "As of May 2026." },

  { n: 30, q: "If the President can no longer serve, who becomes President?",
    accepted: ["the Vice President"],
    distractors: ["the Speaker of the House", "the Secretary of State", "the Chief Justice", "the Senate Majority Leader"] },

  { n: 31, q: "If both the President and the Vice President can no longer serve, who becomes President?",
    accepted: ["the Speaker of the House"],
    distractors: ["the Chief Justice", "the Secretary of State", "the Senate Majority Leader", "the Vice President's Chief of Staff"] },

  { n: 32, q: "Who is the Commander in Chief of the military?",
    accepted: ["the President"],
    distractors: ["the Secretary of Defense", "the Joint Chiefs of Staff", "the Senate", "the Chairman of the Joint Chiefs"] },

  { n: 33, q: "Who signs bills to become laws?",
    accepted: ["the President"],
    distractors: ["the Chief Justice", "the Speaker of the House", "the Vice President", "the Senate Majority Leader"] },

  { n: 34, q: "Who vetoes bills?",
    accepted: ["the President"],
    distractors: ["the Supreme Court", "Congress", "the Senate", "the House of Representatives"] },

  { n: 35, q: "What does the President's Cabinet do?",
    accepted: ["advises the President"],
    distractors: ["passes laws", "interprets the Constitution", "runs elections", "vetoes bills"] },

  { n: 36, q: "What are two Cabinet-level positions?",
    accepted: ["Secretary of Agriculture", "Secretary of Commerce", "Secretary of Defense", "Secretary of Education", "Secretary of Energy", "Secretary of Health and Human Services", "Secretary of Homeland Security", "Secretary of Housing and Urban Development", "Secretary of the Interior", "Secretary of Labor", "Secretary of State", "Secretary of Transportation", "Secretary of the Treasury", "Secretary of Veterans Affairs", "Attorney General", "Vice President"],
    distractors: ["Speaker of the House", "Senate Majority Leader", "Chief of Staff", "Press Secretary", "Surgeon General", "Postmaster General", "Federal Reserve Chair", "FBI Director"],
    requires: 2 },

  { n: 37, q: "What does the judicial branch do?",
    accepted: ["reviews laws", "explains laws", "resolves disputes", "decides if a law goes against the Constitution"],
    distractors: ["writes laws", "signs bills", "vetoes bills", "elects the President", "commands the military"] },

  { n: 38, q: "What is the highest court in the United States?",
    accepted: ["the Supreme Court"],
    distractors: ["the Court of Appeals", "the District Court", "the Federal Circuit Court", "the U.S. Tax Court"] },

  { n: 39, q: "How many justices are on the Supreme Court?",
    accepted: ["nine (9)"],
    distractors: ["seven (7)", "eleven (11)", "thirteen (13)", "twelve (12)"] },

  { n: 40, q: "Who is the Chief Justice of the United States now?",
    accepted: ["John Roberts", "Roberts", "John G. Roberts"],
    distractors: ["Clarence Thomas", "Samuel Alito", "Brett Kavanaugh", "Sonia Sotomayor", "Amy Coney Barrett"],
    note: "John Roberts has been Chief Justice since 2005." },

  { n: 41, q: "Under our Constitution, some powers belong to the federal government. What is one power of the federal government?",
    accepted: ["to print money", "to declare war", "to create an army", "to make treaties"],
    distractors: ["issue driver's licenses", "approve zoning", "run schools", "provide fire departments", "give marriage licenses"] },

  { n: 42, q: "Under our Constitution, some powers belong to the states. What is one power of the states?",
    accepted: ["provide schooling and education", "provide protection (police)", "provide safety (fire departments)", "give a driver's license", "approve zoning and land use"],
    distractors: ["print money", "declare war", "sign treaties", "create an army", "regulate immigration"] },

  { n: 43, q: "Who is the Governor of your state now? (Washington State)",
    accepted: ["Bob Ferguson", "Ferguson"],
    distractors: ["Jay Inslee", "Christine Gregoire", "Gary Locke", "Patty Murray", "Maria Cantwell"],
    note: "Bob Ferguson took office January 15, 2025." },

  { n: 44, q: "What is the capital of your state? (Washington State)",
    accepted: ["Olympia"],
    distractors: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Vancouver"] },

  { n: 45, q: "What are the two major political parties in the United States?",
    accepted: ["Democratic and Republican"],
    distractors: ["Federalist and Whig", "Libertarian and Green", "Liberal and Conservative", "Socialist and Capitalist"] },

  { n: 46, q: "What is the political party of the President now?",
    accepted: ["Republican"],
    distractors: ["Democratic", "Independent", "Libertarian", "Green"],
    note: "Trump is a Republican." },

  { n: 47, q: "What is the name of the Speaker of the House of Representatives now?",
    accepted: ["Mike Johnson", "Johnson", "Michael Johnson"],
    distractors: ["Hakeem Jeffries", "Nancy Pelosi", "Steve Scalise", "Kevin McCarthy", "Chuck Schumer"],
    note: "As of early 2026. Speakers can change — verify at uscis.gov/citizenship/testupdates before your test." },

  { n: 48, q: "There are four amendments to the Constitution about who can vote. Describe one of them.",
    accepted: ["Citizens 18 and older can vote.", "You don't have to pay a poll tax to vote.", "Any citizen can vote (women and men can vote).", "A male citizen of any race can vote."],
    distractors: ["Only landowners can vote.", "Only men can vote.", "You must be born in the U.S. to vote.", "Only people who pay taxes can vote."] },

  { n: 49, q: "What is one responsibility that is only for United States citizens?",
    accepted: ["serve on a jury", "vote in a federal election"],
    distractors: ["pay taxes", "drive a car", "register a business", "obey the law", "respect the flag"] },

  { n: 50, q: "Name one right only for United States citizens.",
    accepted: ["vote in a federal election", "run for federal office"],
    distractors: ["own property", "attend public schools", "speak freely", "practice religion", "bear arms"] },

  { n: 51, q: "What are two rights of everyone living in the United States?",
    accepted: ["freedom of expression", "freedom of speech", "freedom of assembly", "freedom to petition the government", "freedom of religion", "the right to bear arms"],
    distractors: ["free college", "free healthcare", "a federal job", "free housing", "voting in federal elections", "running for federal office", "free public transportation"],
    requires: 2 },

  { n: 52, q: "What do we show loyalty to when we say the Pledge of Allegiance?",
    accepted: ["the United States", "the flag"],
    distractors: ["the President", "the Constitution", "your state", "the military"] },

  { n: 53, q: "What is one promise you make when you become a United States citizen?",
    accepted: ["give up loyalty to other countries", "defend the Constitution and laws of the United States", "obey the laws of the United States", "serve in the U.S. military (if needed)", "serve the nation (if needed)", "be loyal to the United States"],
    distractors: ["pay double taxes", "join the military for two years", "move to Washington D.C.", "give up your prior citizenship immediately", "learn a new language"] },

  { n: 54, q: "How old do citizens have to be to vote for President?",
    accepted: ["eighteen (18) and older"],
    distractors: ["sixteen (16)", "twenty-one (21)", "twenty-five (25)", "thirty (30)"] },

  { n: 55, q: "What are two ways that Americans can participate in their democracy?",
    accepted: ["vote", "join a political party", "help with a campaign", "join a civic group", "join a community group", "give an elected official your opinion on an issue", "call Senators and Representatives", "publicly support or oppose an issue or policy", "run for office", "write to a newspaper"],
    distractors: ["avoid paying taxes", "refuse jury duty", "move out of the country", "start a militia", "ignore elections", "burn the flag"],
    requires: 2 },

  { n: 56, q: "When is the last day you can send in federal income tax forms?",
    accepted: ["April 15"],
    distractors: ["January 1", "July 4", "December 31", "March 15"] },

  { n: 57, q: "When must all men register for the Selective Service?",
    accepted: ["at age eighteen (18)", "between eighteen (18) and twenty-six (26)"],
    distractors: ["age sixteen (16)", "age twenty-one (21)", "age twenty-five (25)", "age thirty (30)"] },

  { n: 58, q: "What is one reason colonists came to America?",
    accepted: ["freedom", "political liberty", "religious freedom", "economic opportunity", "practice their religion", "escape persecution"],
    distractors: ["to escape the Black Death", "to find gold for Spain", "because Britain forced them", "to colonize for France", "to spread feudalism"] },

  { n: 59, q: "Who lived in America before the Europeans arrived?",
    accepted: ["American Indians", "Native Americans"],
    distractors: ["Vikings", "Pilgrims", "English settlers", "French traders", "Spanish missionaries"] },

  { n: 60, q: "What group of people was taken to America and sold as slaves?",
    accepted: ["Africans", "people from Africa"],
    distractors: ["Europeans", "Native Americans", "Chinese", "Irish", "South Americans"] },

  { n: 61, q: "Why did the colonists fight the British?",
    accepted: ["because of high taxes (taxation without representation)", "because the British army stayed in their houses (boarding, quartering)", "because they didn't have self-government"],
    distractors: ["because of religious differences", "because Britain banned slavery", "to gain land in Canada", "because of language differences", "to spread Catholicism"] },

  { n: 62, q: "Who wrote the Declaration of Independence?",
    accepted: ["Thomas Jefferson", "Jefferson"],
    distractors: ["George Washington", "Benjamin Franklin", "John Adams", "James Madison", "Alexander Hamilton"] },

  { n: 63, q: "When was the Declaration of Independence adopted?",
    accepted: ["July 4, 1776"],
    distractors: ["July 4, 1789", "December 25, 1776", "July 4, 1492", "July 4, 1812", "September 17, 1787"] },

  { n: 64, q: "There were 13 original states. Name three.",
    accepted: ["New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania", "Delaware", "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia"],
    distractors: ["California", "Texas", "Florida", "Ohio", "Kentucky", "Tennessee", "Vermont", "Maine", "Michigan", "Alabama"],
    requires: 3 },

  { n: 65, q: "What happened at the Constitutional Convention?",
    accepted: ["The Constitution was written.", "The Founding Fathers wrote the Constitution."],
    distractors: ["The Declaration of Independence was signed.", "The Civil War ended.", "The Louisiana Purchase happened.", "The Bill of Rights was added.", "Slavery was abolished."] },

  { n: 66, q: "When was the Constitution written?",
    accepted: ["1787"],
    distractors: ["1776", "1492", "1812", "1789", "1791"] },

  { n: 67, q: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.",
    accepted: ["James Madison", "Madison", "Alexander Hamilton", "Hamilton", "John Jay", "Jay", "Publius"],
    distractors: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams", "Patrick Henry"] },

  { n: 68, q: "What is one thing Benjamin Franklin is famous for?",
    accepted: ["U.S. diplomat", "oldest member of the Constitutional Convention", "first Postmaster General of the United States", "writer of Poor Richard's Almanac", "started the first free libraries"],
    distractors: ["first President", "wrote the Declaration of Independence", "led the Continental Army", "invented the steam engine", "discovered America"] },

  { n: 69, q: "Who is the \"Father of Our Country\"?",
    accepted: ["George Washington", "Washington"],
    distractors: ["Abraham Lincoln", "Thomas Jefferson", "John Adams", "Benjamin Franklin", "James Madison"] },

  { n: 70, q: "Who was the first President?",
    accepted: ["George Washington", "Washington"],
    distractors: ["John Adams", "Thomas Jefferson", "Benjamin Franklin", "James Madison", "Abraham Lincoln"] },

  { n: 71, q: "What territory did the United States buy from France in 1803?",
    accepted: ["the Louisiana Territory", "Louisiana"],
    distractors: ["Alaska", "Texas", "Florida", "California", "Oregon Territory"],
    note: "Alaska was bought from Russia in 1867." },

  { n: 72, q: "Name one war fought by the United States in the 1800s.",
    accepted: ["War of 1812", "Mexican-American War", "Civil War", "Spanish-American War"],
    distractors: ["World War I", "World War II", "Vietnam War", "Revolutionary War", "Korean War", "Gulf War"] },

  { n: 73, q: "Name the U.S. war between the North and the South.",
    accepted: ["the Civil War", "the War between the States"],
    distractors: ["the Revolutionary War", "the War of 1812", "World War I", "the French and Indian War", "the Mexican-American War"] },

  { n: 74, q: "Name one problem that led to the Civil War.",
    accepted: ["slavery", "economic reasons", "states' rights"],
    distractors: ["religion", "immigration", "taxation by Britain", "westward expansion alone", "language differences"] },

  { n: 75, q: "What was one important thing that Abraham Lincoln did?",
    accepted: ["freed the slaves (Emancipation Proclamation)", "saved (or preserved) the Union", "led the United States during the Civil War"],
    distractors: ["wrote the Constitution", "declared independence", "led the Louisiana Purchase", "founded the Supreme Court", "wrote the Federalist Papers"] },

  { n: 76, q: "What did the Emancipation Proclamation do?",
    accepted: ["freed the slaves", "freed slaves in the Confederacy", "freed slaves in the Confederate states", "freed slaves in most Southern states"],
    distractors: ["ended the Revolutionary War", "granted women the right to vote", "created the Bill of Rights", "ended Prohibition", "founded the United Nations"] },

  { n: 77, q: "What did Susan B. Anthony do?",
    accepted: ["fought for women's rights", "fought for civil rights"],
    distractors: ["invented the cotton gin", "served as First Lady", "led the Underground Railroad", "wrote the Constitution", "founded the Red Cross"],
    note: "Harriet Tubman led the Underground Railroad." },

  { n: 78, q: "Name one war fought by the United States in the 1900s.",
    accepted: ["World War I", "World War II", "Korean War", "Vietnam War", "(Persian) Gulf War"],
    distractors: ["Civil War", "Revolutionary War", "War of 1812", "Spanish-American War", "Mexican-American War"] },

  { n: 79, q: "Who was President during World War I?",
    accepted: ["Woodrow Wilson", "Wilson"],
    distractors: ["Franklin Roosevelt", "Theodore Roosevelt", "William Howard Taft", "Warren Harding", "Herbert Hoover"] },

  { n: 80, q: "Who was President during the Great Depression and World War II?",
    accepted: ["Franklin Roosevelt", "Roosevelt", "FDR", "Franklin D. Roosevelt"],
    distractors: ["Theodore Roosevelt", "Harry Truman", "Dwight Eisenhower", "Herbert Hoover", "Woodrow Wilson"] },

  { n: 81, q: "Who did the United States fight in World War II?",
    accepted: ["Japan, Germany, and Italy"],
    distractors: ["Russia, China, and North Korea", "Britain, France, and Spain", "Vietnam, Korea, and China", "Germany, Austria, and Russia"] },

  { n: 82, q: "Before he was President, Eisenhower was a general. What war was he in?",
    accepted: ["World War II"],
    distractors: ["World War I", "Korean War", "Civil War", "Vietnam War", "Spanish-American War"] },

  { n: 83, q: "During the Cold War, what was the main concern of the United States?",
    accepted: ["Communism"],
    distractors: ["Fascism", "terrorism", "the Great Depression", "imperialism", "monarchy"] },

  { n: 84, q: "What movement tried to end racial discrimination?",
    accepted: ["civil rights movement", "civil rights"],
    distractors: ["the suffragette movement", "Prohibition", "the Progressive Era", "the New Deal", "the Temperance movement"] },

  { n: 85, q: "What did Martin Luther King, Jr. do?",
    accepted: ["fought for civil rights", "worked for equality for all Americans"],
    distractors: ["became President", "wrote the Constitution", "invented the telephone", "led the Underground Railroad", "founded the NAACP"] },

  { n: 86, q: "What major event happened on September 11, 2001, in the United States?",
    accepted: ["Terrorists attacked the United States."],
    distractors: ["A hurricane struck New Orleans.", "The Berlin Wall fell.", "The first man walked on the moon.", "The Vietnam War ended.", "The Soviet Union collapsed."] },

  { n: 87, q: "Name one American Indian tribe in the United States.",
    accepted: ["Cherokee", "Navajo", "Sioux", "Chippewa", "Choctaw", "Pueblo", "Apache", "Iroquois", "Creek", "Blackfeet", "Seminole", "Cheyenne", "Arawak", "Shawnee", "Mohegan", "Huron", "Oneida", "Lakota", "Crow", "Teton", "Hopi", "Inuit"],
    distractors: ["Inca", "Aztec", "Maya", "Olmec", "Toltec", "Zapotec"],
    note: "Inca, Aztec, and Maya are Central/South American — they are NOT acceptable answers." },

  { n: 88, q: "Name one of the two longest rivers in the United States.",
    accepted: ["Missouri", "Mississippi", "Missouri River", "Mississippi River"],
    distractors: ["Colorado", "Rio Grande", "Hudson", "Columbia", "Ohio", "Yukon"] },

  { n: 89, q: "What ocean is on the West Coast of the United States?",
    accepted: ["Pacific", "Pacific Ocean"],
    distractors: ["Atlantic", "Indian", "Arctic", "Southern", "Caribbean"] },

  { n: 90, q: "What ocean is on the East Coast of the United States?",
    accepted: ["Atlantic", "Atlantic Ocean"],
    distractors: ["Pacific", "Indian", "Arctic", "Southern", "Caribbean"] },

  { n: 91, q: "Name one U.S. territory.",
    accepted: ["Puerto Rico", "U.S. Virgin Islands", "American Samoa", "Northern Mariana Islands", "Guam"],
    distractors: ["Cuba", "the Bahamas", "Mexico", "Jamaica", "Hawaii", "Alaska"],
    note: "Hawaii and Alaska are states, not territories." },

  { n: 92, q: "Name one state that borders Canada.",
    accepted: ["Maine", "New Hampshire", "Vermont", "New York", "Pennsylvania", "Ohio", "Michigan", "Minnesota", "North Dakota", "Montana", "Idaho", "Washington", "Alaska"],
    distractors: ["California", "Florida", "Texas", "Arizona", "Nevada", "Georgia", "Oregon"] },

  { n: 93, q: "Name one state that borders Mexico.",
    accepted: ["California", "Arizona", "New Mexico", "Texas"],
    distractors: ["Florida", "Louisiana", "Nevada", "Colorado", "Oklahoma", "Utah"] },

  { n: 94, q: "What is the capital of the United States?",
    accepted: ["Washington, D.C.", "Washington DC", "D.C.", "Washington"],
    distractors: ["New York City", "Philadelphia", "Boston", "Los Angeles", "Chicago"] },

  { n: 95, q: "Where is the Statue of Liberty?",
    accepted: ["New York Harbor", "Liberty Island", "New York", "New Jersey", "near New York City", "on the Hudson"],
    distractors: ["Boston Harbor", "Washington D.C.", "San Francisco Bay", "Philadelphia", "Chicago", "Miami"] },

  { n: 96, q: "Why does the flag have 13 stripes?",
    accepted: ["because there were 13 original colonies", "because the stripes represent the original colonies"],
    distractors: ["because there are 13 amendments", "for each branch times four", "no specific reason", "for the 13 founding fathers", "for the 13 articles of the Constitution"] },

  { n: 97, q: "Why does the flag have 50 stars?",
    accepted: ["because there is one star for each state", "because each star represents a state", "because there are 50 states"],
    distractors: ["because of 50 founding fathers", "because the flag was made in 1950", "no specific reason", "for the 50 amendments", "for 50 years of independence"] },

  { n: 98, q: "What is the name of the national anthem?",
    accepted: ["The Star-Spangled Banner", "Star-Spangled Banner"],
    distractors: ["America the Beautiful", "My Country, 'Tis of Thee", "God Bless America", "This Land Is Your Land", "Yankee Doodle"] },

  { n: 99, q: "When do we celebrate Independence Day?",
    accepted: ["July 4"],
    distractors: ["July 14", "June 4", "January 1", "September 17", "November 11"] },

  { n: 100, q: "Name two national U.S. holidays.",
    accepted: ["New Year's Day", "Martin Luther King, Jr. Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Columbus Day", "Veterans Day", "Thanksgiving", "Christmas"],
    distractors: ["Valentine's Day", "Halloween", "St. Patrick's Day", "Easter", "Mother's Day", "Father's Day", "Groundhog Day", "Black Friday"],
    requires: 2 },
];

if (typeof module !== "undefined") module.exports = QUESTIONS;
