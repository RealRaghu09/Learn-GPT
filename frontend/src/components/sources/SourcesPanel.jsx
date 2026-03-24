import { useRef, useState } from "react";
import {
  uploadPdf,
  postRootContent,
  loadPdfContent,
} from "../../requests/requests";
import { useData } from "../context/dataContext";

function SectionTitle({ children }) {
  return (
    <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[#9aa0a6]">
      {children}
    </h2>
  );
}

export function SourcesPanel() {
  const [pdfLink, setPdfLink] = useState("");
  const [context, setContext] = useState("");
  const [linkError, setLinkError] = useState("");
  const [result, setResult] = useState(null);
  const { finalData, setFinalData } = useData();
  const [uploadStatus, setUploadStatus] = useState("");
  const [status, setStatus] = useState(""); // message
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // ---------------- PDF Upload ----------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      console.log("Uploading PDF...");
      const result = await uploadPdf(formData);

      setUploadStatus("Done!");
      setFinalData(result.text || "");
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("Error uploading PDF");
    }
  };

  // ---------------- Link Validation ----------------
  const validatePdfLink = (link) => {
    if (!link) return true;

    const urlPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

    if (!urlPattern.test(link)) {
      setLinkError("Invalid URL");
      return false;
    }

    if (!link.includes("http")) {
      setLinkError("Invalid URL");
      return false;
    }

    setLinkError("");
    return true;
  };

  const handleLinkChange = (e) => {
    const link = e.target.value;
    setPdfLink(link);
    validatePdfLink(link);
  };

  // ---------------- MAIN SUBMIT ----------------
  const handleSubmit = async () => {

    if (pdfLink && context) {
      setStatus("Use only one");
      return;
    }


    if (!pdfLink && !context) {
      setStatus("Provide at least one");
      return;
    }

    try {
      setLoading(true);
      setStatus("Started Working");

      let response;

      if (pdfLink) {
        if (!validatePdfLink(pdfLink)) return;

        response = await loadPdfContent({ content : pdfLink });
      } else {
        response = await postRootContent({
          content: context,
          type: "text",
        });
      }

      setResult(response);
      setFinalData(response?.response || context);

      setStatus("Done");
    } catch (err) {
      console.error(err);
      setStatus("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex h-full min-h-[320px] flex-col gap-6 overflow-y-auto p-4">
      <div>
        <SectionTitle>Sources</SectionTitle>
        <p className="mb-4 text-sm text-[#bdc1c6]">
          Add PDF, link, or text.
        </p>
      </div>

      {/* PDF Upload */}
      <section>
        <SectionTitle>PDF</SectionTitle>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#5f6368] bg-[#1e1f20] px-4 py-8 hover:bg-[#28292a]"
        >
          <span className="text-sm text-[#e8eaed]">Upload PDF</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
        />

        {uploadStatus && (
          <p className="text-sm text-[#bdc1c6] mt-2 text-center">
            {uploadStatus}
          </p>
        )}
      </section>

      {/* Link */}
      <section>
        <SectionTitle>Link</SectionTitle>
        <input
          type="text"
          value={pdfLink}
          onChange={handleLinkChange}
          placeholder="https://example.pdf"
          className="w-full rounded-lg border border-[#3c4043] bg-[#28292a] px-3 py-2 text-sm text-white"
        />
        {linkError && (
          <p className="text-red-400 text-xs mt-1">{linkError}</p>
        )}
      </section>

      {/* Context */}
      <section>
        <SectionTitle>Text</SectionTitle>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Enter text..."
          className="w-full rounded-lg border border-[#3c4043] bg-[#28292a] px-3 py-2 text-sm text-white"
        />
      </section>

      {/* Submit Button */}
      <section>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2
            ${
              loading
                ? "bg-[#3c4043] text-[#9aa0a6]"
                : "bg-[#8ab4f8] text-black hover:bg-[#a1c2fa]"
            }
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {loading ? "Working..." : status === "Done" ? "Done" : "Submit"}
        </button>

        {status && (
          <p className="text-center text-sm text-[#bdc1c6] mt-2">
            {status}
          </p>
        )}
      </section>
    </div>
  );
}