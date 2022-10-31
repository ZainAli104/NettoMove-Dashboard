import dayjs from "dayjs"

export function required(message = "You can't leave this field empty") {
    return (v) => !!v || message
}

export function password(message = "Password should be six characters long") {
    return (v) => !!v && v.length >= 6 || message
}


export  function startDateValidation() {
    var  isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
    var  isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
    dayjs.extend(isSameOrAfter)
    dayjs.extend(isSameOrBefore)

    return (v) => {
        const givenDate = dayjs(v)
        const date = dayjs()
        if(date.date() == givenDate.date() && date.month() == givenDate.month() && date.year() == givenDate.year()) {
            return givenDate.isSameOrBefore(date)
        } else {
            return givenDate.isSameOrAfter(date)
        }
    }
}

export function endDateValidation(selectedDate) { 
    return (v) => {
        const givenDate = dayjs(v)
        const date = dayjs(selectedDate)
        return givenDate.isAfter(date)
    }
}

export const requiredV2 = (value) =>
    (+value >= 0 && value !== '') || "You can't leave this field empty"


export function requiredPercentage(message = "Percentage is not accurate!") {
    return (v) => !!v && v > 0 && v <= 100 || message
}

export function dynamicQuestion(message) {
    return (v) => !!v && v.includes("{{c") || message
}

export function requiredArray(message = "You can't leave this field empty") {
    return (v) => !!v && v.length > 0 || message
}

export function trialValidator() {
    return (v) => (v === true || v === false) || "You can't leave this field empty"
}

export function email(message = "This email is not valid") {
    return (v) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || message
}

export function answerValidator(type) {
    if (type === 'bool') {
        return (v) => (v && (v === 'true' || v === 'false')) || 'Answer should be the true or false.';
    } else {
        return (v) => (v && (!/^[a-zA-Z]+$/.test(v) || v.trim().length === 1)) || 'Answer should be the between A and Z.';
    }
}

export const passageQuestionsValidator = (v, list) => {
    let count = 0
    for (const item of list) {
        if (item.question === v.question) {
            count++
        }
    }

    return count > 1 ? 'Question is already selected.' : true
}

