import { API_URL } from "./const.js";
import { convertStringToNumber } from "./convertStringToNumber.js";
// import { OverlayScrollBars } from "./overlayscrollbars.esm.min.js";

const typesOperation = {
  income: "дохід",
  expenses: "витрата",
};

const financeForm = document.querySelector(".finance__form");
const financeAmount = document.querySelector(".finance__amount");
const financeReport = document.querySelector(".finance__report");
const reportBox = document.querySelector(".report");
const reportOperationList = document.querySelector(".report__operation-list");
const reportDates = document.querySelector(".report__dates");

let amount = 0;
financeAmount.textContent = amount;

financeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const typeOperation = e.submitter.dataset.typeOperation;

  const changeAmount = Math.abs(
    convertStringToNumber(financeForm.amount.value)
  );

  if (typeOperation === "income") {
    amount += changeAmount;
  }

  if (typeOperation === "expenses") {
    amount -= changeAmount;
  }

  financeAmount.textContent = `${amount.toLocaleString()} ₴`;
});

const getData = async (url) => {
  try {
    const res = await fetch(`${API_URL}${url}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
    throw error;
  }
};

const closeReport = ({ target }) => {
  if (
    target.closest(".report__close") ||
    (!target.closest(".report") && target !== financeReport)
  ) {
    reportBox.classList.remove("report__open");
    document.removeEventListener("click", closeReport);
  }
};

const openReport = () => {
  reportBox.classList.add("report__open");

  document.addEventListener("click", closeReport);
};

const reformatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

const renderReport = (data) => {
  reportOperationList.textContent = "";

  const reportRows = data.map(
    ({ category, amount, description, date, type }) => {
      const reportRow = document.createElement("tr");
      reportRow.classList.add("report__row");

      reportRow.innerHTML = `
      <td class="report__cell">${category}</td>
      <td class="report__cell report__cell_amount">${amount.toLocaleString()}&nbsp;₴</td>
      <td class="report__cell">${description}</td>
      <td class="report__cell">${reformatDate(date)}</td>
      <td class="report__cell">${typesOperation[type]}</td>
      <td class="report__action-cell">
        <button
          class="report__button report__button_table">&#10006;</button>
      </td>
    `;

      return reportRow;
    }
  );

  reportOperationList.append(...reportRows);
};

financeReport.addEventListener("click", async () => {
  openReport();
  const data = await getData("test");
  renderReport(data);
});

reportDates.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(reportDates));

  const searchParams = new URLSearchParams();

  if (formData.startDate) {
    searchParams.append("startDate", formData.startDate);
  }

  if (formData.endDate) {
    searchParams.append("endDate", formData.endDate);
  }

  const queryStr = searchParams.toString();
  const url = queryStr ? `test?${queryStr}` : "test";

  const data = await getData(url);
  renderReport(data);
});

// OverlayScrollBars(reportBox, {});
