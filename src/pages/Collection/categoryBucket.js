const BAG_CATEGORIES = [
    '가방',
    '핸드백',
    '토트백',
    '백팩',
    '클러치',
    '트래블',
    'bag',
]

const ACCESSORY_CATEGORIES = [
    '악세',
    '액세',
    '벨트',
    '스카프',
    '지갑',
    '키링',
    '헤어밴드',
    'accessory',
]

export const bucketOf = (category = '') => {
    const normalized = category.trim().toLowerCase()

    if (BAG_CATEGORIES.some((value) => normalized.includes(value))) {
        return 'bag'
    }

    if (ACCESSORY_CATEGORIES.some((value) => normalized.includes(value))) {
        return 'accessory'
    }

    return 'clothing'
}
