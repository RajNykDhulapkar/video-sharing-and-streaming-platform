function omit<T>(obj: T, property: keyof T | (keyof T)[]): Omit<T, keyof T> {
    const newObj = { ...obj };
    if (Array.isArray(property)) {
        property.forEach((prop) => delete newObj[prop]);
    } else {
        delete newObj[property];
    }
    return newObj;
}

export default omit;

// function omit<T>(obj: T, property: keyof T | (keyof T)[]) {
//     if (Array.isArray(property)) {
//         const entries = Object.entries(obj).filter((item) => {
//             const [key] = item;
//             return !property.includes(key as keyof T);
//         });
//         return Object.fromEntries(entries);
//     }
//     const { [property]: unused, ...rest } = obj;
//     return rest;
// }
