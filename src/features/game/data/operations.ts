import { Operation } from "../models/games-model";

export const OPERATIONS: Operation[][] = [
  [
    { operation: "10 + 12", result: 22 },
    { operation: "20 + 3", result: 23 },
    { operation: "5 + 3 + 3", result: 11 },
    { operation: "4 x 7", result: 28 },
    { operation: "15 - 8", result: 7 },
    { operation: "30 / 5", result: 6 },
    { operation: "18 + 7 - 3", result: 22 },
    { operation: "12 x 2", result: 24 },
    { operation: "40 / 4 + 5", result: 15 },
    { operation: "6 x 5 - 2", result: 28 },
    { operation: "10 + 12 / 4", result: 13 },
    { operation: "8 x 3", result: 24 },
    { operation: "50 / 5 + 6", result: 16 },
    { operation: "7 x 4 - 9", result: 19 },
    { operation: "60 / 3 x 2", result: 40 }
  ],
  [
    { operation: "8 + 10", result: 18 },
    { operation: "25 - 5", result: 20 },
    { operation: "6 + 4 + 5", result: 15 },
    { operation: "3 x 9", result: 27 },
    { operation: "22 - 7", result: 15 },
    { operation: "50 / 10", result: 5 },
    { operation: "17 + 8 - 5", result: 20 },
    { operation: "15 x 3", result: 45 },
    { operation: "20 / 2 + 10", result: 20 },
    { operation: "5 x 6 - 1", result: 29 },
    { operation: "30 + 10 / 2", result: 35 },
    { operation: "9 x 4", result: 36 },
    { operation: "45 / 9 + 5", result: 10 },
    { operation: "8 x 5 - 3", result: 37 },
    { operation: "72 / 6 x 3", result: 36 }
  ],
  [
    { operation: "12 + 14", result: 26 },
    { operation: "28 - 4", result: 24 },
    { operation: "7 + 5 + 2", result: 14 },
    { operation: "6 x 6", result: 36 },
    { operation: "24 - 9", result: 15 },
    { operation: "40 / 8", result: 5 },
    { operation: "21 + 9 - 5", result: 25 },
    { operation: "18 x 2", result: 36 },
    { operation: "30 / 2 + 8", result: 23 },
    { operation: "7 x 7 - 6", result: 43 },
    { operation: "45 + 15 / 3", result: 50 },
    { operation: "10 x 4", result: 40 },
    { operation: "60 / 10 + 8", result: 14 },
    { operation: "9 x 6 - 2", result: 52 },
    { operation: "48 / 6 x 3", result: 24 }
  ],
  [
    { operation: "5 + 7", result: 12 },
    { operation: "30 - 15", result: 15 },
    { operation: "9 + 3 + 6", result: 18 },
    { operation: "2 x 8", result: 16 },
    { operation: "21 - 6", result: 15 },
    { operation: "35 / 7", result: 5 },
    { operation: "13 + 8 - 3", result: 18 },
    { operation: "14 x 2", result: 28 },
    { operation: "40 / 2 + 6", result: 26 },
    { operation: "9 x 5 - 4", result: 41 },
    { operation: "25 + 5 / 5", result: 26 },
    { operation: "11 x 3", result: 33 },
    { operation: "56 / 8 + 9", result: 16 },
    { operation: "12 x 4 - 8", result: 40 },
    { operation: "18 / 6 x 5", result: 15 }
  ],
  [
    { operation: "9 + 6", result: 15 },
    { operation: "40 - 12", result: 28 },
    { operation: "8 + 5 + 7", result: 20 },
    { operation: "7 x 3", result: 21 },
    { operation: "18 - 4", result: 14 },
    { operation: "72 / 9", result: 8 },
    { operation: "19 + 6 - 3", result: 22 },
    { operation: "20 x 2", result: 40 },
    { operation: "32 / 4 + 10", result: 18 },
    { operation: "12 x 2 - 5", result: 19 },
    { operation: "35 + 10 / 2", result: 40 },
    { operation: "9 x 7", result: 63 },
    { operation: "64 / 8 + 4", result: 12 },
    { operation: "15 x 2 - 10", result: 20 },
    { operation: "30 / 5 x 4", result: 24 }
  ],
  [
    { operation: "14 + 6", result: 20 },
    { operation: "22 - 9", result: 13 },
    { operation: "7 + 3 + 5", result: 15 },
    { operation: "9 x 2", result: 18 },
    { operation: "30 - 12", result: 18 },
    { operation: "50 / 5", result: 10 },
    { operation: "14 + 10 - 3", result: 21 },
    { operation: "5 x 8", result: 40 },
    { operation: "64 / 8 + 2", result: 10 },
    { operation: "10 x 3 - 5", result: 25 },
    { operation: "18 + 6 / 2", result: 21 },
    { operation: "12 x 3", result: 36 },
    { operation: "56 / 8 + 4", result: 11 },
    { operation: "7 x 5 - 4", result: 31 },
    { operation: "72 / 6 x 2", result: 24 }
  ],
  [
    { operation: "5 + 15", result: 20 },
    { operation: "33 - 11", result: 22 },
    { operation: "9 + 6 + 5", result: 20 },
    { operation: "11 x 2", result: 22 },
    { operation: "40 - 14", result: 26 },
    { operation: "60 / 6", result: 10 },
    { operation: "16 + 9 - 5", result: 20 },
    { operation: "8 x 4", result: 32 },
    { operation: "72 / 8 + 3", result: 12 },
    { operation: "6 x 6 - 3", result: 33 },
    { operation: "25 + 10 / 5", result: 27 },
    { operation: "15 x 2", result: 30 },
    { operation: "48 / 6 + 5", result: 13 },
    { operation: "14 x 4 - 7", result: 49 },
    { operation: "80 / 10 x 2", result: 16 }
  ],
  [
    { operation: "18 + 7", result: 25 },
    { operation: "55 - 20", result: 35 },
    { operation: "10 + 4 + 6", result: 20 },
    { operation: "60 - 18", result: 42 },
    { operation: "90 / 9", result: 10 },
    { operation: "17 + 12 - 4", result: 25 },
    { operation: "16 x 2", result: 32 },
    { operation: "54 / 9 + 7", result: 13 },
    { operation: "8 x 5 - 6", result: 34 },
    { operation: "20 + 30 / 5", result: 26 },
    { operation: "18 x 3", result: 54 },
    { operation: "70 / 7 + 8", result: 18 },
    { operation: "12 x 6 - 10", result: 62 },
    { operation: "13 x 3", result: 39 },
    { operation: "90 / 15 x 4", result: 24 }
  ],
  [
    { operation: "3 + 17", result: 20 },
    { operation: "60 - 30", result: 30 },
    { operation: "8 + 9 + 3", result: 20 },
    { operation: "12 x 4", result: 48 },
    { operation: "27 - 9", result: 18 },
    { operation: "36 / 6", result: 6 },
    { operation: "10 + 15 - 5", result: 20 },
    { operation: "10 x 3", result: 30 },
    { operation: "49 / 7 + 6", result: 13 },
    { operation: "4 x 7 - 5", result: 23 },
    { operation: "15 + 10 / 5", result: 17 },
    { operation: "20 x 2", result: 40 },
    { operation: "36 / 4 + 9", result: 18 },
    { operation: "9 x 6 - 8", result: 46 },
    { operation: "54 / 9 x 5", result: 30 }
  ],
  [
    { operation: "2 + 18", result: 20 },
    { operation: "44 - 12", result: 32 },
    { operation: "5 + 10 + 5", result: 20 },
    { operation: "6 x 5", result: 30 },
    { operation: "50 - 15", result: 35 },
    { operation: "64 / 8", result: 8 },
    { operation: "12 + 13 - 5", result: 20 },
    { operation: "4 x 9", result: 36 },
    { operation: "56 / 7 + 4", result: 12 },
    { operation: "7 x 6 - 8", result: 34 },
    { operation: "12 + 6 / 3", result: 14 },
    { operation: "25 x 2", result: 50 },
    { operation: "40 / 4 + 9", result: 19 },
    { operation: "9 x 8 - 10", result: 62 },
    { operation: "48 / 8 x 3", result: 18 }
  ]
];
