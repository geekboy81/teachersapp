export const SEMESTER_STATUS = {
    complete: 'Complete',
    progress: 'In Progress',
    published: 'Published To Parents',
    ready: 'Ready for Marking',
};

export const SEMESTER_CODES = {
    complete: 2,
    progress: 1,
    published: 3,
};

export function getSemesterStatus(moduleInfo, childId, year, semester) {
    console.log('year', year);
    console.log('semester', semester);

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
    let code = SEMESTER_CODES.progress;

    switch(semesterStatus) {
        case SEMESTER_STATUS.complete:
            code = SEMESTER_CODES.complete;
            break;
        case SEMESTER_STATUS.progress:
            code = SEMESTER_CODES.progress;
            break;
        case SEMESTER_STATUS.published:
            code = SEMESTER_CODES.published;
            break;
        default:
            code = SEMESTER_CODES.progress;
            break;
    }

    return code;
}
