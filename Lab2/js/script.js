const addTeacherBtns = document.querySelectorAll(
  ".add-teacher-btn"
);
const modalCloseBtns = document.querySelectorAll(
  ".modal-close-btn"
);
const addTeacherModal = document.getElementById(
  "add-teacher-modal"
);
const teacherInfoModal = document.getElementById(
  "teacher-info-modal"
);
const cards = document.querySelectorAll(".card");

for (const btn of addTeacherBtns) {
  btn.addEventListener("click", () => {
    addTeacherModal.classList.add("is-open");
  });
}

for (const btn of modalCloseBtns) {
  btn.addEventListener("click", () => {
    if (addTeacherModal.classList.contains("is-open")) {
      addTeacherModal.classList.remove("is-open");
    }
    if (teacherInfoModal.classList.contains("is-open")) {
      teacherInfoModal.classList.remove("is-open");
    }
  });
}

for (const card of cards) {
  card.addEventListener("click", () => {
    teacherInfoModal.classList.add("is-open");
  });
}
