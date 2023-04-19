const { v4: uuidv4 } = require("uuid");
const {
  additionalUsers,
  randomUserMock,
} = require("./FE4U-Lab3-mock");

const courseList = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics",
];

//Assignment 1
const transformUserData = (data) => {
  const transformedData = randomUserMock.map((teacher) => {
    return {
      id: uuidv4(),
      gender:
        teacher.gender.charAt(0).toUpperCase() +
        teacher.gender.slice(1),
      title: teacher.name.title,
      full_name: `${teacher.name.first} ${teacher.name.last}`,
      city: teacher.location.city,
      state: teacher.location.state,
      country: teacher.location.country,
      postcode: teacher.location.postcode,
      coordinates: teacher.location.coordinates,
      timezone: teacher.location.timezone,
      email: teacher.email,
      b_date: teacher.dob.date,
      age: teacher.dob.age,
      phone: teacher.phone,
      picture_Large: teacher.picture.large,
      picture_thumbnail: teacher.picture.thumbnail,
      favourite: false,
      courseList:
        courseList[
          Math.floor(Math.random() * courseList.length)
        ],
      bg_color: "#9b9b9b",
      note: "",
    };
  });
  return transformedData;
};
const teacherList = transformUserData(randomUserMock);

const mergeTwoArrayOfObjects = (
  firstArray,
  secondArray
) => {
  const mergedArray = [...firstArray, ...secondArray];
  const result = mergedArray.reduce((acc, curr) => {
    if (
      !acc.find(
        (obj) => obj["full_name"] === curr["full_name"]
      )
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);
  return result;
};
const teacherListMerged = mergeTwoArrayOfObjects(
  teacherList,
  additionalUsers
);
//console.log(teacherListMerged, teacherListMerged.length);

//Assignment 2
const isUpperCase = (str) => {
  return str.charAt(0) === str.charAt(0).toUpperCase();
};

const validateTeacherData = (teacherInfo) => {
  const {
    full_name,
    gender,
    note,
    state,
    city,
    country,
    age,
    phone,
    email,
  } = teacherInfo;
  if (
    typeof full_name !== "string" ||
    !isUpperCase(full_name)
  ) {
    throw new Error("Input correct full name " + full_name);
  }
  if (typeof gender !== "string" || !isUpperCase(gender)) {
    throw new Error("Input correct gender");
  }
  if (typeof note !== "string" || !isUpperCase(note)) {
    throw new Error("Input correct note");
  }
  if (typeof state !== "string" || !isUpperCase(state)) {
    throw new Error("Input correct state");
  }
  if (typeof city !== "string" || !isUpperCase(city)) {
    throw new Error("Input correct city");
  }
  if (
    typeof country !== "string" ||
    !isUpperCase(country)
  ) {
    throw new Error("Input correct country");
  }
  if (typeof age !== "number") {
    throw new Error("Please, input number");
  }
  if (!email.includes("@")) {
    throw new Error("Please, input correct email");
  }
};

const submitHandler = (data) => {
  try {
    validateTeacherData(data);
    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
};

//submitHandler(teacherListMerged[0]);

//Assignment 3
const filterTeachers = (
  list,
  country,
  age,
  gender,
  favorite
) => {
  return list.filter((teacher) => {
    return (
      (country === undefined ||
        teacher.country === country) &&
      (age === undefined || teacher.age === age) &&
      (gender === undefined || teacher.gender === gender) &&
      (favorite === undefined ||
        teacher.favorite === favorite)
    );
  });
};
/*console.log(
  filterTeachers(teacherListMerged, "Germany", 35, "Female")
);*/

//Assignment 4
const sortTeacherList = (
  list,
  isASC = true,
  country,
  age,
  gender,
  favorite
) => {
  const sortByKey = (key) =>
    list.sort((a, b) => {
      if (a[key] > b[key] && isASC) {
        return 1;
      }
      if (a[key] > b[key] && !isASC) {
        return -1;
      }
      if (a[key] < b[key] && isASC) {
        return -1;
      }
      if (a[key] < b[key] && !isASC) {
        return 1;
      }
      return 0;
    });
  if (country) {
    return sortByKey("country");
  }
  if (age) {
    if (isASC) {
      return list.sort((a, b) => a.age - b.age);
    } else {
      return list.sort((a, b) => b.age - a.age);
    }
  }
  if (gender) {
    return sortByKey("gender");
  }
  if (favorite) {
    return sortByKey("favorite");
  }
  return list;
};

//console.log(sortTeacherList(teacherListMerged, true));

//Assignment 5
const findTeacher = (list, searchParams) => {
  return list.filter(
    (teacher) =>
      teacher[searchParams.key] === searchParams.value
  );
};
/*console.log(
  findTeacher(teacherListMerged, {
    key: "country",
    value: "Germany",
  })
);*/

//Assignment 6
const getPercentage = (list) => {
  const listLength = list.length;
  const search_result = findTeacher(list, {
    key: "country",
    value: "Norway",
  });
  console.log(search_result);
  const percentage =
    (search_result.length / listLength) * 100;
  return percentage;
};
console.log(getPercentage(teacherListMerged));
