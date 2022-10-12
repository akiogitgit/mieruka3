export const options = {
  series: [
    {
      data: [[0, 0]],
      shadow: true,
      color: "#2BAEF0",
    },
  ],
  title: {
    text: "",
  },
  subtitle: {
    text: "",
  },
  xAxis: {
    title: {
      text: "日付",
    },
    type: "datetime",
    minPadding: 0.1,
    maxPadding: 0,
    // showLastLabel: true,
    // tickInterval: 24 * 3600,
    labels: {
      format: "{value:%Y-%m-%d}",
    },
  },
  yAxis: {
    title: {
      text: "",
    },
    opposite: true,
    offset: 0,
  },
  exporting: {
    enabled: true,
  },
  plotOptions: {
    series: {
      animation: false,
    },
    area: {
      fillColor: false,
      lineWidth: 2,
      threshold: null,
    },
  },
  scrollbar: {
    enabled: true,
  },
  navigator: {
    enabled: false,
  },
  rangeSelector: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
}
