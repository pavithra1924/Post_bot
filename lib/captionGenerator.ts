import { ThemeId } from './themes';

export interface ViralCaptionResult {
  hook: string;
  explanation: string;
  insight: string; // Compatibility alias for explanation
  actionChallenge: string;
  cta: string;
  captionHashtags: string[];
  hashtags: string[]; // Compatibility alias for captionHashtags
  firstCommentHashtags: string[];
  totalHashtagsCount: number;
  fullCaption: string;
  firstComment: string;
}

// 50+ Curated Hashtags Pool per Theme (30 for Caption + 22 for First Comment Booster)
const THEME_HASHTAG_BANKS: Record<string, { caption: string[]; firstComment: string[] }> = {
  fire_sunset: {
    caption: [
      '#SparkWithin', '#InnerFire', '#DisciplineOverMotivation', '#MentalFortitude', '#MindsetShift',
      '#Unbreakable', '#PersonalGrowthDaily', '#RelentlessPursuit', '#StoicMindset', '#SelfMastery',
      '#RiseFromAshes', '#InnerStrength', '#DailyMotivationQuote', '#HardWorkPaysOff', '#FocusOnYourself',
      '#OvercomeObstacles', '#ConsistencyIsKey', '#GritAndGrace', '#NeverGiveUpOnYourself', '#DreamBigger',
      '#BuildYourEmpire', '#NoExcusesJustResults', '#DailyDiscipline', '#MindsetOfAChampion', '#QuietConfidence',
      '#BeYourOwnHero', '#ElevateYourMind', '#InnerDrive', '#StrengthWithin', '#FuelYourFire'
    ],
    firstComment: [
      '#MorningMotivation', '#MindsetDaily', '#SuccessMindset', '#GrowthMindsetQuotes', '#MotivationalPage',
      '#DailyInspirationQuote', '#PowerOfMind', '#WarriorSpirit', '#BeRelentless', '#ConquerFromWithin',
      '#HighValueMindset', '#PersonalDevelopmentJourney', '#MentalToughness', '#KeepPushingForward', '#SparksFly',
      '#HabitsOfSuccess', '#BelieveInYourselfDaily', '#DeepThoughtsDaily', '#VisionaryMind', '#DailyWisdom'
    ]
  },
  stoic_marble: {
    caption: [
      '#DailyStoic', '#MarcusAurelius', '#StoicismWisdom', '#StoicPhilosophy', '#SparkWithin',
      '#InnerPeace', '#AmorFati', '#MementoMori', '#SelfControl', '#EmotionalMastery',
      '#AncientWisdom', '#PhilosophyQuotes', '#CalmUnderPressure', '#QuietMastery', '#VirtueAboveAll',
      '#MindOverMatter', '#DwellInQuiet', '#CharacterIsDestiny', '#MasterYourself', '#InternalPower',
      '#ClarityOfMind', '#NoReaction', '#ControlWhatYouCan', '#StoicPractices', '#InnerFortress',
      '#ThoughtfulLiving', '#HighStandards', '#WisdomDaily', '#TimelessWisdom', '#SenecaQuotes'
    ],
    firstComment: [
      '#Epictetus', '#StoicMind', '#WisdomOfAges', '#PhilosophyDaily', '#DeepThinkers',
      '#ClarityAndFocus', '#PeacefulWarrior', '#StoicLife', '#VirtuousLife', '#MasteryDaily',
      '#ModernStoic', '#SelfGovernance', '#Unshakable', '#RationalMind', '#InnerStillness',
      '#MindfulStoic', '#AncientPhilosophy', '#PersonalMastery', '#SelfReflectionDaily', '#StoicDiscipline'
    ]
  },
  emerald_forest: {
    caption: [
      '#SilentGrowth', '#RootsGrowDeep', '#PatienceAndDiscipline', '#SparkWithin', '#QuietConsistency',
      '#TrustTheUnseen', '#NatureWisdom', '#SubconsciousMind', '#LongTermVision', '#InnerCalm',
      '#GroundedMindset', '#DeepRoots', '#MindfulGrowth', '#KeepGrowingDaily', '#SilentWork',
      '#SlowAndSteady', '#OrganicGrowth', '#SelfElevation', '#DailyPatience', '#TrustTheProcess',
      '#DeepFocus', '#MentalPeace', '#QuietProgress', '#InvisibleWork', '#GrowthSeason',
      '#StillnessSpeaks', '#SolitudePower', '#InTheQuiet', '#PlantSeedsDaily', '#UnshakableRoots'
    ],
    firstComment: [
      '#MindfulnessDaily', '#InnerZen', '#CalmMindset', '#SlowLivingMovement', '#RootedStrength',
      '#PeacefulMind', '#NaturePhilosophy', '#QuietHabits', '#UnstoppableGrowth', '#SoulGrowth',
      '#DeepBreathing', '#PresentMomentAwareness', '#MentalHealthMatters', '#MindsetMattersMost', '#DailyPeace',
      '#InnerHarmony', '#SilentAchievers', '#ConsistentActions', '#EvolveDaily', '#EmbraceTheJourney'
    ]
  },
  cosmic_galaxy: {
    caption: [
      '#CosmicMindset', '#SparkInTheDark', '#InfinitePotential', '#SparkWithin', '#UniversalEnergy',
      '#HigherPurpose', '#LimitlessMind', '#StarlightMind', '#VisionaryThinking', '#BoundlessSpirit',
      '#MindsetOfAbundance', '#ThinkBeyondLimits', '#CosmicPerspective', '#ElevateYourFrequency', '#StardustAndGrit',
      '#GrandVision', '#OvercomeLimits', '#DestinedForGreatness', '#DeepCosmos', '#PurposeDrivenLife',
      '#DreamWithoutLimits', '#SoulElevation', '#StarStuff', '#VibrateHigherDaily', '#EndlessPossibilities',
      '#UniversalLaw', '#HigherConsciousness', '#AwakenTheGiant', '#CosmicWisdom', '#ShineInDarkness'
    ],
    firstComment: [
      '#SpiritualGrowth', '#ManifestYourDestiny', '#UniverseHasYourBack', '#GalaxyMind', '#InnerLight',
      '#CosmicAwakening', '#BoundlessVision', '#StarsCannotShineWithoutDarkness', '#InfiniteBeing', '#ElevatedLife',
      '#SoulCalling', '#HigherSelfAwakening', '#MindsetTransformation', '#DeepSpaceThoughts', '#LimitlessSoul',
      '#UniversalMind', '#KeepReachingHigher', '#CosmicJourney', '#PurposeAndPassion', '#VisionaryLife'
    ]
  },
  minimal_linen: {
    caption: [
      '#MinimalistMindset', '#SimplicityIsKey', '#EliminateNoise', '#SparkWithin', '#EssentialLiving',
      '#PeaceOfMind', '#IntentionalLiving', '#ClarityAndFocus', '#LessIsMore', '#QuietElegance',
      '#InnerStillness', '#DeclutterYourMind', '#PureFocus', '#SophisticatedSimplicity', '#SubtlePower',
      '#LiveWithPurpose', '#FocusOnEssentials', '#CleanMindset', '#UncomplicatedLife', '#DailyClarity',
      '#SereneLiving', '#QualityOverQuantity', '#ArchitectOfYourLife', '#MindfulLiving', '#ZenMindset',
      '#MasterSimplicity', '#NoDistractions', '#CalmSpace', '#QuietLiving', '#SimpleDailyHabits'
    ],
    firstComment: [
      '#MinimalismDaily', '#CalmAndCollected', '#IntentionalMind', '#SimplicityQuotes', '#EleganceInSimplicity',
      '#InnerSanctuary', '#QuietHabits', '#FocusedMindset', '#CleanAesthetics', '#EssentialismLiving',
      '#WabiSabiMind', '#ClearThinking', '#SimplicityMatters', '#PeacefulMindset', '#DailyZen',
      '#LessStuffMoreLife', '#MindfulHabits', '#CalmEnergy', '#SimpleJoy', '#SerenityDaily'
    ]
  },
  cyber_midnight: {
    caption: [
      '#NightGrind', '#RelentlessDiscipline', '#WhileTheySleep', '#SparkWithin', '#MidnightFocus',
      '#LaserFocused', '#ObsessedWithGrowth', '#OutworkEveryone', '#NocturnalGrind', '#DailyExcellence',
      '#HabitsOfGreatness', '#TunnelVision', '#DisciplineEqualsFreedom', '#RelentlessEffort', '#ShadowGrind',
      '#BuildInSilence', '#UnmatchedWorkEthic', '#GrindNeverStops', '#LateNightVibes', '#WorkEthic',
      '#GritAndGlory', '#FutureIsNow', '#HustleInSilence', '#UnstoppableForce', '#MentalDomination',
      '#RelentlessDrive', '#DisciplineOverEverything', '#NightOwlMindset', '#LockIn', '#NoDistractions'
    ],
    firstComment: [
      '#GrindsetDaily', '#RelentlessMindset', '#HardWorkOverLuck', '#BuiltDifferent', '#NocturnalCreator',
      '#DarkAestheticGrind', '#CyberFocus', '#MidnightHustle', '#LaserVision', '#ObsessionBeatsTalent',
      '#ExecuteDaily', '#NoExcusesPolicy', '#NightDriveThoughts', '#RelentlessAmbition', '#WinningMindset',
      '#LateNightWork', '#FocusModeOn', '#ColdWorkEthic', '#GrindToGlory', '#UnshakableDiscipline'
    ]
  },
  vintage_journal: {
    caption: [
      '#TimelessWisdom', '#CharacterIsDestiny', '#LegacyBuilding', '#SparkWithin', '#IntegrityFirst',
      '#OldSoulMindset', '#ClassicWisdom', '#WordsOfWisdom', '#LifeLessonsLearned', '#TrueWealth',
      '#LiteraryInspiration', '#QuietDignity', '#StandForSomething', '#AuthenticLiving', '#MoralCourage',
      '#DepthOfCharacter', '#PhilosophicalThoughts', '#VintageSoul', '#DeepThinkerQuotes', '#LegacyMindset',
      '#TimelessPrinciples', '#InnerNobility', '#WriteYourStory', '#HonorAndIntegrity', '#SoulWisdom',
      '#WisdomOfGenerations', '#TruthAndHonor', '#DeepConversations', '#TimelessWords', '#LiveHonorably'
    ],
    firstComment: [
      '#BookishMindset', '#DarkAcademiaVibes', '#VintagePhilosophy', '#OldSoulThoughts', '#CharacterMatters',
      '#ClassicLiterature', '#MindfulLegacy', '#AuthenticSoul', '#TimelessTruths', '#DeepIntellect',
      '#PhilosophersCorner', '#TrueIntegrity', '#SoulReflection', '#DailyReadingHabit', '#WisdomKeepers',
      '#GentlemansCode', '#NobleMindset', '#HistoricalWisdom', '#ThoughtfulWords', '#LegacyOfWisdom'
    ]
  }
};

/**
 * Generates an in-depth educational viral caption with 50+ hashtags (30 caption + 22 first comment).
 */
export async function generateViralCaption(
  quote: string,
  author: string,
  themeId: ThemeId,
  apiKey?: string
): Promise<ViralCaptionResult> {
  const bank = THEME_HASHTAG_BANKS[themeId] || THEME_HASHTAG_BANKS.fire_sunset;

  // Try Gemini AI if API Key is available
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an elite Instagram growth strategist and philosopher for the brand "@_sparkwithin_hub_".
Write an exceptional, deeply insightful viral Instagram caption for this quote:
Quote: "${quote}"
Author: ${author}

Structure the caption with:
1. Hook: 1 punchy scroll-stopping line with an emoji.
2. Deep Explanation: 2-3 detailed, powerful paragraphs explaining the psychological and philosophical meaning behind this quote, why people struggle with it, and what it teaches about self-mastery.
3. Daily Action Challenge: 1 practical mindset shift or habit to apply today.
4. CTA: A compelling call to save and share this post.

Format your response as valid JSON:
{
  "hook": "...",
  "explanation": "...",
  "actionChallenge": "...",
  "cta": "..."
}`
            }]
          }]
        })
      });

      if (response.ok) {
        const json = await response.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);

          const fullCaption = `${parsed.hook}\n\n${parsed.explanation}\n\n💡 DAILY CHALLENGE:\n${parsed.actionChallenge}\n\n${parsed.cta}\n\n—\nFollow @${author === 'Spark Within' ? '_sparkwithin_hub_' : '_sparkwithin_hub_'} for daily mindset transformation.\n\n${bank.caption.join(' ')}`;
          const firstComment = `🚀 Growth Booster Tags:\n${bank.firstComment.join(' ')}`;

          return {
            hook: parsed.hook,
            explanation: parsed.explanation,
            insight: parsed.explanation,
            actionChallenge: parsed.actionChallenge,
            cta: parsed.cta,
            captionHashtags: bank.caption,
            hashtags: bank.caption,
            firstCommentHashtags: bank.firstComment,
            totalHashtagsCount: bank.caption.length + bank.firstComment.length,
            fullCaption,
            firstComment
          };
        }
      }
    } catch (err) {
      console.warn('Gemini caption generation fallback to heuristic:', err);
    }
  }

  // High-Grade Heuristic Storytelling Generator
  const isOriginal = author.toLowerCase().includes('spark within');
  const cleanAuthor = author.trim() || 'Spark Within';

  const hook = isOriginal 
    ? "Read this twice before you move forward today 👇"
    : `What ${cleanAuthor} understood about human nature will change how you look at today 👇`;

  const explanation = `Most people wait for the world to give them permission to be great. They look outside for validation, waiting for perfect timing, easier circumstances, or someone else to validate their potential.\n\nBut real power does not come from external applause—it comes from the quiet, persistent standard you hold when no one is watching. The difference between those who drift and those who master their destiny is the willingness to protect their inner standard every single day.\n\nWhen you realize that your mind controls your response to every situation, nothing outside of you has the power to extinguish your momentum.`;

  const actionChallenge = "Audit your focus today. Identify one distraction or negative reaction that drains your energy and eliminate it. Replace it with 30 minutes of deep, uninterrupted progress toward what matters most.";

  const cta = "📌 SAVE this post to re-read whenever you need to recalibrate your mindset.\n🚀 SHARE this with someone who needs this reminder today.";

  const fullCaption = `${hook}\n\n"${quote}"\n— ${cleanAuthor}\n\n${explanation}\n\n💡 THE DAILY CHALLENGE:\n${actionChallenge}\n\n${cta}\n\n—\nFollow @_sparkwithin_hub_ for daily mindset shifts & inner mastery.\n\n${bank.caption.join(' ')}`;

  const firstComment = `🚀 Growth Booster Tags:\n${bank.firstComment.join(' ')}`;

  return {
    hook,
    explanation,
    insight: explanation,
    actionChallenge,
    cta,
    captionHashtags: bank.caption,
    hashtags: bank.caption,
    firstCommentHashtags: bank.firstComment,
    totalHashtagsCount: bank.caption.length + bank.firstComment.length,
    fullCaption,
    firstComment
  };
}
