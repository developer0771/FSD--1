const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combinedArr = [...arr1, ...arr2];
    console.log(combinedArr); // Output: [1, 2, 3, 4, 5, 6]

    function sumAll(...numbers) {
        return numbers.reduce((acc, curr) => acc + curr, 0);
    }
    console.log(sumAll(1, 2, 3, 4, 5)); // Output: 15       