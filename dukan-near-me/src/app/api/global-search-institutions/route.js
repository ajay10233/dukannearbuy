import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

function getClosestMatch(word, options) {
  const levenshtein = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0)
    )
    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1)
      }
    }
    return dp[a.length][b.length]
  }

  let minDistance = Infinity
  let bestMatch = null
  for (const option of options) {
    const distance = levenshtein(word.toLowerCase(), option.toLowerCase())
    if (distance < minDistance) {
      minDistance = distance
      bestMatch = option
    }
  }
  return minDistance <= 2 ? bestMatch : null
}

export async function GET(req) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams)

  if (!search) {
    return NextResponse.json({ message: 'Search query is required' }, { status: 400 })
  }

  const keywords = search.split(/\s+/).filter(Boolean)

  // Prisma search with all address fields
  const conditions = keywords.flatMap((word) => [
    { city: { contains: word, mode: 'insensitive' } },
    { state: { contains: word, mode: 'insensitive' } },
    { zipCode: { contains: word, mode: 'insensitive' } },
    { country: { contains: word, mode: 'insensitive' } },
    { firmName: { contains: word, mode: 'insensitive' } },
    { shopAddress: { contains: word, mode: 'insensitive' } },
    { landmark: { contains: word, mode: 'insensitive' } },
    { hashtags: { has: word.toLowerCase() } },
    { houseNumber: { contains: word, mode: 'insensitive' } },
    { street: { contains: word, mode: 'insensitive' } },
    { buildingName: { contains: word, mode: 'insensitive' } },
  ])

  const results = await prisma.user.findMany({
    where: {
      role: { in: ['INSTITUTION', 'SHOP_OWNER'] },
      OR: conditions,
    },
    select: {
      id: true,
      firmName: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      shopAddress: true,
      profilePhoto: true,
      latitude: true,
      longitude: true,
    },
  })

  // "Did you mean" if no results
  let suggestions = []
  if (results.length === 0) {
    const sampleValues = await prisma.user.findMany({
      where: { role: { in: ['INSTITUTION', 'SHOP_OWNER'] } },
      take: 100,
      select: {
        firmName: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        shopAddress: true,
        landmark: true,
        houseNumber: true,
        street: true,
        buildingName: true,
        hashtags: true,
      },
    })

    const allWords = new Set()
    for (const item of sampleValues) {
      const fields = [
        item.firmName,
        item.city,
        item.state,
        item.zipCode,
        item.country,
        item.shopAddress,
        item.landmark,
        item.houseNumber,
        item.street,
        item.buildingName,
        ...(item.hashtags || []),
      ]
      fields.forEach((f) => {
        if (f) allWords.add(f)
      })
    }

    keywords.forEach((word) => {
      const match = getClosestMatch(word, [...allWords])
      if (match && !suggestions.includes(match)) {
        suggestions.push(match)
      }
    })
  }

  return NextResponse.json({ results, suggestions })
}
