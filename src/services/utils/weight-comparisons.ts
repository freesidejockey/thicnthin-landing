/**
 * Utility functions for generating fun weight comparisons and encouragement messages
 */

interface WeightObject {
  weight: number
  description: string
}

const WEIGHT_OBJECTS: WeightObject[] = [
  { weight: 0.5, description: '2 sticks of butter' },
  { weight: 1, description: 'a guinea pig' },
  { weight: 2, description: 'a bag of sugar' },
  { weight: 3, description: 'an average human brain' },
  { weight: 4, description: 'a house cat' },
  { weight: 5, description: 'a chihuahua' },
  { weight: 8, description: 'a gallon of paint' },
  { weight: 10, description: 'a bowling ball' },
  { weight: 12, description: 'a bald eagle' },
  { weight: 15, description: 'a medium microwave' },
  { weight: 20, description: 'a car tire' },
  { weight: 25, description: 'a 2-year-old child' },
  { weight: 30, description: 'a large bag of dog food' },
  { weight: 40, description: 'a 5-gallon water jug' },
  { weight: 50, description: 'a large dog' },
  { weight: 60, description: 'a large TV' },
  { weight: 70, description: 'an adult golden retriever' },
  { weight: 80, description: 'an average 12-year-old' },
  { weight: 100, description: 'a baby elephant' },
  { weight: 150, description: 'a large deer' },
  { weight: 200, description: 'a refrigerator' },
  { weight: 300, description: 'a grand piano' },
  { weight: 500, description: 'a polar bear' },
]

/**
 * Get a fun comparison object for a given weight
 */
export function getWeightObjectComparison(weightInPounds: number): string {
  // Handle negative weight (weight gain)
  const absWeight = Math.abs(weightInPounds)

  if (absWeight < 0.25) {
    return 'a stick of butter'
  }

  // Find the closest weight object
  let closest = WEIGHT_OBJECTS[0]
  let minDiff = Math.abs(absWeight - closest.weight)

  for (const obj of WEIGHT_OBJECTS) {
    const diff = Math.abs(absWeight - obj.weight)
    if (diff < minDiff) {
      minDiff = diff
      closest = obj
    }
  }

  return closest.description
}

interface GroupComparisonData {
  userRank: number
  totalMembers: number
  isTopPerformer: boolean
  weightLost: number
  groupTotalWeightLost: number
}

/**
 * Generate an encouraging message based on group comparison
 */
export function generateGroupComparisonMessage(
  data: GroupComparisonData,
): string {
  const { userRank, totalMembers, isTopPerformer, weightLost, groupTotalWeightLost } = data

  if (isTopPerformer && weightLost > 0) {
    return `You lost the most weight of anyone in the group!`
  }

  if (userRank === 1 && totalMembers > 1) {
    return `You're #1 in your group this period!`
  }

  if (userRank <= 3 && totalMembers > 3) {
    return `You're in the top 3 performers in your group!`
  }

  const percentile = ((totalMembers - userRank + 1) / totalMembers) * 100

  if (percentile >= 50) {
    return `You're in the top ${Math.round(percentile)}% of your group!`
  }

  // Encouraging message for those not at the top
  if (weightLost > 0) {
    return `Keep up the great work! Every pound matters!`
  } else if (weightLost === 0) {
    return `Remember, consistency is key. Keep checking in!`
  } else {
    return `Don't give up! Every journey has ups and downs.`
  }
}

interface IndividualMetrics {
  weightChange: number
  checkInConsistency: number
  avgCravings: number
  calorieGoalAdherence: number
}

/**
 * Generate a personalized encouraging message for individual performance
 */
export function generatePersonalMessage(metrics: IndividualMetrics): string {
  const { weightChange, checkInConsistency, avgCravings, calorieGoalAdherence } = metrics

  const messages: string[] = []

  // Weight change message
  if (weightChange < 0) {
    const absChange = Math.abs(weightChange)
    const weightObj = getWeightObjectComparison(absChange)
    messages.push(
      `This period, you lost ${absChange.toFixed(1)} lbs - that's the weight of ${weightObj}!`,
    )
  } else if (weightChange > 0) {
    messages.push(
      `Your weight increased by ${weightChange.toFixed(1)} lbs this period. Don't get discouraged - keep pushing forward!`,
    )
  } else {
    messages.push('Your weight remained stable this period.')
  }

  // Consistency message
  if (checkInConsistency >= 80) {
    messages.push('Your check-in consistency is excellent!')
  } else if (checkInConsistency >= 60) {
    messages.push('Good job staying consistent with check-ins!')
  } else if (checkInConsistency < 40) {
    messages.push('Try to check in more regularly for better tracking.')
  }

  // Cravings message
  if (avgCravings <= 2) {
    messages.push("You're managing your cravings like a champ!")
  } else if (avgCravings >= 4) {
    messages.push('Consider strategies to help manage those cravings.')
  }

  // Calorie goal message
  if (calorieGoalAdherence >= 80) {
    messages.push("You're crushing your calorie goals!")
  } else if (calorieGoalAdherence >= 60) {
    messages.push('Nice work staying on track with your calorie goals!')
  }

  return messages.join(' ')
}

interface MemberPerformance {
  profileId: string
  firstName: string
  lastName: string
  weightLost: number
}

/**
 * Identify members to give shoutouts to (exclude the current user)
 */
export function identifyPeersToShoutout(
  groupMembers: MemberPerformance[],
  currentProfileId: string,
  maxShoutouts: number = 2,
): MemberPerformance[] {
  // Filter out current user and those who gained weight or had no change
  const eligibleMembers = groupMembers
    .filter(m => m.profileId !== currentProfileId && m.weightLost > 0)
    .sort((a, b) => b.weightLost - a.weightLost) // Sort by weight lost descending
    .slice(0, maxShoutouts)

  return eligibleMembers
}

/**
 * Generate a shoutout message for a group member
 */
export function generateShoutoutMessage(member: MemberPerformance): string {
  const firstName = member.firstName || 'your teammate'
  return `Be sure to congratulate ${firstName} on their awesome progress - they're down ${member.weightLost.toFixed(1)} lbs!`
}
