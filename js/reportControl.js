import { OverlayScrollbars } from "./overlayscrollbars.esm.min.js";
import { financeControl } from "./financeControl.js";
import { clearChart, generateChart } from "./generateChart.js";
import { reformatDate } from "./helpers.js";
import { deleteData, getData } from "./service.js";

const financeReport = document.querySelector(".finance__report");
const reportBox = document.querySelector(".report");
const reportOperationList = document.querySelector(".report__operation-list");
const reportDates = document.querySelector(".report__dates");
const generateChartButton = document.querySelector("#generateChartButton");

OverlayScrollbars(reportBox, {});

const typesOperation = {
  income: "дохід",
  expenses: "витрата",
};

let actualData = [];

const closeReport = ({ target }) => {
  if (
    target.closest(".report__close") ||
    (!target.closest(".report") && target !== financeReport)
  ) {
    gsap.to(reportBox, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete() {
        reportBox.style.visibility = "hidden";
      },
    });

    document.removeEventListener("click", closeReport);
  }
};

const openReport = () => {
  reportBox.style.visibility = "visible";

  gsap.to(reportBox, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "power2.out",
  });

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

      clearChart();
    }
  });

  financeReport.addEventListener("click", async () => {
    const textContent = financeReport.textContent;
    financeReport.textContent = "Завантаження ...";
    financeReport.disabled = true;
    actualData = await getData("finance");
    financeReport.textContent = textContent;
    financeReport.disabled = false;
    renderReport(actualData);
    openReport();
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

    actualData = await getData(url);
    console.log("actualData: ", actualData);
    renderReport(actualData);
    clearChart();
  });
};

generateChartButton.addEventListener("click", () => {
  generateChart(actualData);
});
