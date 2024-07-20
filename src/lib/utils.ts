import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });
  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function createDateAsUTC(date: Date) {
  console.log(date.getFullYear(), date.getMonth(), date.getDate());
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function convertDateToUTC(date: Date) {
  console.log(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function getKey(object: any, key: string) {
  if (key.includes(".")) {
    const keys = key.split(".");
    let value = object;
    for (let i = 0; i < keys.length; i++) {
      if (!value) return "";
      value = value[keys[i]];
    }
    return value;
  }

  return object[key];
}

export const template = (tpl: string, args: any): string =>
  tpl.replace(/\${(\w+)}/g, (_, v) => getKey(args, v));

/**
 * Transforms a POJO into a FormData.
 * How to use: When you have a <form onSubmit={form.HandleSubmit(submittingFunction)} ...
 * In your submittingFunction you do:
 * function submittingFunction(data) {
 *  const formData = toFormData(data); //Transform to formData
 *  const result = JSON.parse(myServerAction(formData))
 *  ... //Do what you want with the response :)
 * @param input An POJO containing the form data.
 * @returns A FormData version of the input object with any non string/blob/Date(They get .toString() instead of JSON.stringified) values JSON.stringified.
 */
export function toFormData(input: any): FormData {
  const env = process.env.NODE_ENV;
  const formData = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      formData.append(key, value);
    } else if (value instanceof File) {
      formData.append(key, value, sanitizeString(value.name));
    } else if (value instanceof Date) {
      //@ts-ignore
      formData.append(key, value);
    } else {
      if (env === "development") {
        console.log("JSON.stringifying an object, be careful with this.");
      }
      formData.append(key, JSON.stringify(value));
    }
  }
  return formData;
}

/**
 * error: {
 *   issues: [{
 *     message: //message
 *       path: //fieldName
 *     }]}*/

export function formatZodIssue(issue: ZodIssue) {
  if (!issue.path) {
    return `Error: ${issue.message}`;
  }
  return `Error on field '${issue.path}': ${issue.message}`;
}

//Basically URI encode except instead of encoding the characters that arn't URI characters
// we yeet them.
export function sanitizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-_.!~*'();/?:@&=+$,#%]/g, "");
}

/**
 *
 * @param data
 * @returns { current: any[], past: any[] } //Can we add field assertion?
 */
export function filterByDate(
  data: any[] //How do you do any[] that has the field endDate?
) {
  const todayDateWithoutTime = new Date();
  todayDateWithoutTime.setHours(0, 0, 0, 0); //If we end up adding a time picker to the events, we should change use a different function.

  const current = data.filter((item: any) => {
    return item.endDate >= todayDateWithoutTime;
  });

  const past = data.filter((item: any) => {
    return item.endDate < todayDateWithoutTime;
  });

  return { current, past };
}

export const regexEscape = (string: string) => {
  const specials = [
    "/",
    ".",
    "*",
    "+",
    "?",
    "|",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "\\",
  ];

  return string.replace(
    new RegExp("(\\" + specials.join("|\\") + ")", "g"),
    "\\$1"
  );
};
