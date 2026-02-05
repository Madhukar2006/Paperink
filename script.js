const textInput = document.getElementById("text-input");
const preview = document.getElementById("document-preview");
const handwritingSelect = document.getElementById("handwriting-style");
const paperSelect = document.getElementById("paper-style");
const inkSelect = document.getElementById("ink-color");
const fontUpload = document.getElementById("font-upload");
const paperUpload = document.getElementById("paper-upload");
const fontSizeSelect = document.getElementById("font-size");

// Update preview text with a smooth fade
textInput.addEventListener("input", () => {
  preview.style.opacity = 0;
  setTimeout(() => {
    preview.textContent = textInput.value;
    preview.style.opacity = 1;
  }, 150);
});

// Change handwriting font
handwritingSelect.addEventListener("change", () => {
  preview.classList.remove("indie", "patrick", "caveat", "shadows", "gloria", "architect", "hindiFont");
  preview.classList.add(handwritingSelect.value);
});

// Change paper style
paperSelect.addEventListener("change", () => {
  preview.classList.remove("plain", "lined", "grid", "vintage", "hindi");
  preview.style.backgroundImage = ""; // reset custom paper
  preview.classList.add(paperSelect.value);
});

// Change ink color
inkSelect.addEventListener("change", () => {
  preview.classList.remove("ink-black", "ink-blue", "ink-red", "ink-green");
  preview.classList.add(inkSelect.value);
});

// Adjust font size
fontSizeSelect.addEventListener("change", () => {
  preview.style.fontSize = fontSizeSelect.value + "px";
});
               
// Upload custom handwriting font
fontUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const font = new FontFace("CustomFont", ev.target.result);
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        preview.style.fontFamily = "CustomFont";
      });
    };
    reader.readAsArrayBuffer(file);
  }
});

// Upload custom paper background
paperUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.style.backgroundImage = `url(${ev.target.result})`;
      preview.style.backgroundSize = "cover";
    };
    reader.readAsDataURL(file);
  }
});

// Export document as PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  html2canvas(preview).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("paperink-output.pdf");
  });
});

// Download as PNG
document.getElementById("download-png").addEventListener("click", () => {
  html2canvas(preview).then(canvas => {
    const link = document.createElement("a");
    link.download = "paperink-output.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Print document
document.getElementById("print-doc").addEventListener("click", () => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write("<pre style='font-family:" +
    getComputedStyle(preview).fontFamily +
    "; font-size:" +
    getComputedStyle(preview).fontSize +
    ";'>" +
    preview.textContent +
    "</pre>");
  printWindow.document.close();
  printWindow.print();
});



