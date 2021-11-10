import { Misfit } from 'knight-validation'

export function containsMisfit(field: string, misfitType: string, misfits: Misfit[]): boolean {
    for (let misfit of misfits) {
        if (misfit.field == field && misfit.name == misfitType) {
            return true
        }
    }

    return false
}