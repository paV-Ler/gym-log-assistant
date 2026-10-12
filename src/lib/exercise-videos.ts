// YouTube video ids of form tutorials for the default exercises, keyed by lower-case name.
// English-language channels with a large audience; ScottHermanFitness unless noted.
const VIDEO_IDS: Readonly<Record<string, string>> = {
  "bench press": "rT7DgCr-3pg",
  "incline dumbbell press": "8iPEnn-ltC8",
  "dumbbell fly": "eozdVDA78K0",
  "cable crossover": "Iwe6AmxVf7o",
  "push-up": "IODxDxX7oi4", // Calisthenicmovement
  dip: "sM6XUdt1rm4",
  deadlift: "-4qRntuXBSc", // Buff Dudes
  "barbell row": "9efgcAjQe7E",
  "pull-up": "eGo4IYlbE5g", // Calisthenicmovement
  "lat pulldown": "CAwf7n6Luuc",
  "seated cable row": "GZbfZ033f74",
  "t-bar row": "j3Igk5nyZE4",
  squat: "1oed-UmAxFs",
  "front squat": "tlfahNdNPPI",
  "romanian deadlift": "JCXUYuzwNrM",
  "leg press": "IZxyjW7MPJQ",
  "walking lunge": "Pbmj6xPo-Hw", // Buff Dudes Workouts
  "leg extension": "YyvSfVjQeL0",
  "leg curl": "ELOCsoDSmrg",
  "standing calf raise": "3UWi44yN-wM",
  "overhead press": "2yjwXTZQDDI",
  "seated dumbbell press": "qEwKCR5JCog",
  "lateral raise": "3VcKaXpzqRo",
  "rear delt fly": "ttvfGg9d76c",
  "face pull": "rep-qVOkqgk",
  "barbell curl": "QZEqB6wUPxQ",
  "dumbbell hammer curl": "zC3nLlEvin4",
  "preacher curl": "fIWP-FRFNU0", // KAGED
  "triceps pushdown": "2-LAMcpzODU",
  "skull crusher": "d_KZxkY_0cM",
  "close-grip bench press": "nEF0bv2FW94",
  plank: "pSHjTRCQxIw",
  "hanging leg raise": "hdng3Nm1x_E",
  "cable crunch": "2fbujeH3F0E",
  "side plank": "NXr4Fw8q60o", // Howcast
  "ab wheel rollout": "rqiTPdK1c_I", // Mind Pump TV
};

export const exerciseVideoId = (name: string): string | undefined =>
  VIDEO_IDS[name.trim().toLocaleLowerCase()];
