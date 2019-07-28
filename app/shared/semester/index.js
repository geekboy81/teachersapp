export const SEMESTER_STATUS = {
    complete: 'Complete',
    progress: 'In Progress',
    published: 'Published To Parents',
    ready: 'Ready for Marking',
};

export const SEMESTER_STATUS_COLORS = {
    [SEMESTER_STATUS.complete]: 'steelblue',
    [SEMESTER_STATUS.progress]: 'sandybrown',
    [SEMESTER_STATUS.published]: 'limegreen',
    [SEMESTER_STATUS.ready]: 'pink',
};


export const SEMESTER_CODES = {
    [SEMESTER_STATUS.complete]: 2,
    [SEMESTER_STATUS.progress]: 1,
    [SEMESTER_STATUS.published]: 3,
};

export function getSemesterStatus(moduleInfo, childId, year, semester) {
    const childSummary = Object.values(moduleInfo.groups)
        .reduce((result, item) => (
        item && item.childids && result.concat(item.childids)
        ), [])
        .filter(record => record.childid == childId);

    if (childSummary.length > 0) {
        const { summary } = childSummary[0];
        const semesterSummary = Object.values(summary).find(item => (
        item.year == year &&
        item.slice == semester
        ));

        return semesterSummary ? semesterSummary.status : SEMESTER_STATUS.ready;
    }

    return SEMESTER_STATUS.ready;
}

export function getStatusCode(semesterStatus) {
    return SEMESTER_CODES[semesterStatus] || 1;
}
