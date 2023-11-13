import { financeControl } from "./financeControl.js";
import { reformatDate } from "./helpers.js";
import { deleteData, getData } from "./service.js";

const financeReport = document.querySelector(".finance__report");
const reportBox = document.querySelector(".report");
const reportOperationList = document.querySelector(".report__operation-list");
const reportDates = document.querySelector(".report__dates");

const typesOperation = {
  income: "дохід",
  expenses: "витрата",
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

const renderReport = (data) => {
  reportOperationList.textContent = "";

  const reportRows = data.map(
    ({ id, category, amount, description, date, type }) => {
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
            class="report__button report__button_table" data-id=${id}>&#10006;</button>
        </td>
      `;

      return reportRow;
    }
  );

  reportOperationList.append(...reportRows);
};

export const reportControl = () => {
  reportOperationList.addEventListener("click", async ({ target }) => {
    const btnDelOperation = target.closest(".report__button_table");
    if (btnDelOperation) {
      await deleteData(`finance/${btnDelOperation.dataset.id}`);

      const reportRow = btnDelOperation.closest(".report__row");
      reportRow.remove();
      financeControl();

      // !todo clearChart()
    }
  });

  financeReport.addEventListener("click", async () => {
    openReport();
    const data = await getData("finance");
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
    const url = queryStr ? `finance?${queryStr}` : "finance";

    const data = await getData(url);
    renderReport(data);
  });
};
