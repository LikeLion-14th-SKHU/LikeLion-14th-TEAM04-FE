export const isSelectable = (concept) =>
    concept.isUnlocked && concept.status === 'IMAGE_READY'

export const isConceptLocked = (concept, isAdmin) =>
    !isAdmin && !concept.isUnlocked

export const arrangeConcepts = (concepts) => {
    const ordered = [...concepts].sort(
        (a, b) => a.displayOrder - b.displayOrder,
    )
    const visibleIndex = ordered.findIndex(isSelectable)

    if (visibleIndex < 0 || ordered.length < 2) return ordered

    const [visible] = ordered.splice(visibleIndex, 1)

    return [ordered[0], visible, ...ordered.slice(1)]
}
