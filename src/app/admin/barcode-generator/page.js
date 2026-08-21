"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/utils/supabase";
import AdminLayout from "../components/AdminLayout";

export default function BarcodeGenerator() {
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [copies, setCopies] = useState(1);
  const [generatingKey, setGeneratingKey] = useState(null);

  // ─── USB scanner input state ───
  // When user clicks 📷 on a variant, we set scanTarget and focus a hidden input.
  // The USB scanner types the barcode + Enter into that input.
  const [scanTarget, setScanTarget] = useState(null); // { product, variantIndex }
  const [scanInput, setScanInput] = useState("");
  const scanInputRef = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setFetching(true);
    const { data } = await supabase.from("products").select("*").eq("is_active", true);
    setProducts(data || []);
    setFetching(false);
  };

  // Focus the hidden input whenever a scan target is set
  useEffect(() => {
    if (scanTarget) {
      setScanInput("");
      setTimeout(() => scanInputRef.current?.focus(), 50);
    }
  }, [scanTarget]);

  // ─── Save barcode to Supabase ───
  const saveBarcodeToVariant = async (product, variantIndex, barcodeValue) => {
    const updatedVariants = product.variants.map((v, i) =>
      i === variantIndex ? { ...v, barcode: barcodeValue } : v
    );
    const { error } = await supabase
      .from("products")
      .update({ variants: updatedVariants })
      .eq("id", product.id);

    if (error) { alert("Failed to save barcode"); return null; }

    setProducts((prev) =>
      prev.map((p) => p.id === product.id ? { ...p, variants: updatedVariants } : p)
    );
    return { ...product, variants: updatedVariants };
  };

  // ─── Handle USB scanner Enter key ───
  const handleScanSubmit = async (e) => {
    if (e.key !== "Enter") return;
    const code = scanInput.trim();
    if (!code || !scanTarget) return;

    await saveBarcodeToVariant(scanTarget.product, scanTarget.variantIndex, code);
    setScanInput("");
    setScanTarget(null);
  };

  // ─── Generate barcode SVG (dynamic import — no SSR crash) ───
  const generateBarcode = async (el, value) => {
    if (!el || !value) return;
    try {
      const JsBarcode = (await import("jsbarcode")).default;
      JsBarcode(el, value, {
        format: "CODE128",
        width: 1.3,
        height: 30,
        displayValue: true,
        fontSize: 8,
        margin: 1,
        textMargin: 1,
      });
    } catch (e) {
      console.warn("Barcode error:", e);
    }
  };

  // ─── Add label to queue ───
  // If variant already has barcode → just add. If not → auto-generate + save.
  const addLabel = async (product, variant, variantIndex) => {
    const key = `${product.id}-${variantIndex}`;

    // ✅ Already has barcode — just add to queue, no Supabase call
    if (variant.barcode) {
      setSelectedLabels((prev) => [...prev, { product, variant, qty: copies }]);
      return;
    }

    // No barcode — auto-generate and save
    setGeneratingKey(key);
    const barcodeValue = `KN${Date.now().toString().slice(-8)}${variantIndex}`;
    const updated = await saveBarcodeToVariant(product, variantIndex, barcodeValue);
    setGeneratingKey(null);
    if (!updated) return;

    setSelectedLabels((prev) => [
      ...prev,
      { product: updated, variant: updated.variants[variantIndex], qty: copies },
    ]);
  };

  const removeLabel = (index) => setSelectedLabels((prev) => prev.filter((_, i) => i !== index));
  const updateQty = (index, qty) =>
    setSelectedLabels((prev) => prev.map((l, i) => (i === index ? { ...l, qty: Number(qty) } : l)));

  const handlePrint = () => {
    if (selectedLabels.length === 0) return alert("Add at least one label");
    window.print();
  };

  const expandedLabels = selectedLabels.flatMap((l) => Array(l.qty).fill(l));
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; top: 0; left: 0; width: 58mm; padding: 0; margin: 0; }
          @page { size: 58mm auto; margin: 0; }
        }
      `}</style>

      {/* ─── Hidden input for USB barcode scanner ─── */}
      <input
        ref={scanInputRef}
        value={scanInput}
        onChange={(e) => setScanInput(e.target.value)}
        onKeyDown={handleScanSubmit}
        onBlur={() => {
          // If user clicks away accidentally, refocus if scan is still active
          if (scanTarget) setTimeout(() => scanInputRef.current?.focus(), 100);
        }}
        className="fixed opacity-0 pointer-events-none w-0 h-0"
        readOnly={false}
      />

      <div className="md:p-6 mx-auto max-w-5xl">
        <h1 className="text-xl font-bold mb-4">🏷️ Barcode Label Generator</h1>

        {/* ─── Scan target banner ─── */}
        {scanTarget && (
          <div className="mb-4 flex items-center justify-between bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                📡 Waiting for scan...
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Scan barcode for: <span className="font-bold">
                  {scanTarget.product.name} — {scanTarget.product.variants[scanTarget.variantIndex]?.label}
                </span>
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">Point USB scanner at the barcode and scan</p>
            </div>
            <button
              onClick={() => { setScanTarget(null); setScanInput(""); }}
              className="text-yellow-600 hover:text-red-500 text-xl ml-4"
            >✖</button>
          </div>
        )}

        {/* ─── TWO COLUMN LAYOUT ─── */}
        <div className="flex gap-4 items-start">

          {/* LEFT — Product list */}
            <div className="flex-1 min-w-0 flex flex-col">
            {/* Copies + Search */}
             <div className="flex gap-2 mb-3 py-2 border-b z-20">
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="text-sm text-gray-600 whitespace-nowrap">Copies:</label>
                <input
                  type="number" min="1" max="100" value={copies}
                  onChange={(e) => setCopies(Number(e.target.value))}
                  className="border rounded p-1 w-16 text-center text-sm"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="text" placeholder="Search product..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 w-full pr-7 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">✕</button>
                )}
              </div>
            </div>

            {/* Product + variant rows */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {fetching ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border rounded-lg p-3 h-12" />
                ))
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-gray-400 py-6">No products found</p>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="border rounded-lg bg-white overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-b">
                      <p className="font-medium text-sm">{p.name}</p>
                    </div>
                    <div className="divide-y">
                      {(p.variants || []).map((v, i) => {
                        const key = `${p.id}-${i}`;
                        const isGenerating = generatingKey === key;
                        const isScanning = scanTarget?.product.id === p.id && scanTarget?.variantIndex === i;

                        return (
                          <div key={i} className={`flex items-center justify-between px-3 py-2 gap-2 ${isScanning ? "bg-yellow-50" : ""}`}>
                            <div className="text-sm min-w-0">
                              <span className="font-medium">{v.label}</span>
                              {v.mrp && <span className="ml-2 text-gray-500 text-xs">MRP ₹{v.mrp}</span>}
                              {v.barcode
                                ? <span className="ml-2 text-gray-400 font-mono text-xs">{v.barcode}</span>
                                : <span className="ml-2 text-orange-400 text-xs">No barcode</span>
                              }
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              {/* USB scan to assign barcode — only show if no barcode yet */}
  <button
  onClick={() => setScanTarget({ product: p, variantIndex: i })}
  title={v.barcode ? "Re-scan to change barcode" : "Scan with USB scanner to assign barcode"}
  className={`text-xs px-2 py-1 rounded-full text-white ${
    isScanning ? "bg-yellow-500" : v.barcode ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
  }`}
>
  {isScanning ? "📡 Scanning..." : v.barcode ? "🔌 Re-scan" : "🔌 Scan"}
</button>
                              {/* Add to print queue */}
                              <button
                                onClick={() => addLabel(p, v, i)}
                                disabled={isGenerating}
                                className={`text-xs px-3 py-1 rounded-full text-white transition-all ${
                                  isGenerating
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                              >
                                {isGenerating ? "⏳ Generating..." : "+ Add"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {(!p.variants || p.variants.length === 0) && (
                        <p className="text-xs text-gray-400 px-3 py-2">No variants</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT — Print Queue sticky panel */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto"></div>
            <div className="border rounded-lg bg-white overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-purple-50 border-b">
                <h2 className="font-semibold text-sm text-purple-800">
                  🖨️ Print Queue ({expandedLabels.length})
                </h2>
                {selectedLabels.length > 0 && (
                  <button onClick={() => setSelectedLabels([])} className="text-xs text-red-500 underline">
                    Clear
                  </button>
                )}
              </div>

              {selectedLabels.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8 px-3">
                  Click "+ Add" on a variant to queue labels for printing
                </p>
              ) : (
                <div className="divide-y max-h-[60vh] overflow-y-auto">
                  {selectedLabels.map((l, i) => (
                    <div key={i} className="px-3 py-2 flex items-center justify-between gap-2">
                      <div className="text-xs min-w-0">
                        <p className="font-medium truncate">{l.product.name}</p>
                        <p className="text-purple-600">{l.variant.label}</p>
                        {l.variant.mrp && <p className="text-gray-400">MRP ₹{l.variant.mrp}</p>}
                        <p className="text-gray-300 font-mono">{l.variant.barcode}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <input
                          type="number" min="1" value={l.qty}
                          onChange={(e) => updateQty(i, e.target.value)}
                          className="w-12 text-center border rounded p-1 text-xs"
                        />
                        <button onClick={() => removeLabel(i)} className="text-red-400 text-sm">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedLabels.length > 0 && (
                <div className="p-3 border-t">
                  <button
                    onClick={handlePrint}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold text-sm"
                  >
                    🖨️ Print {expandedLabels.length} Label{expandedLabels.length !== 1 ? "s" : ""}
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* PRINT AREA — invisible on screen, prints on thermal */}
        <div id="print-area" className="hidden print:block">
          {expandedLabels.map((l, i) => (
            <PrintLabel key={i} product={l.product} variant={l.variant} generateBarcode={generateBarcode} />
          ))}
        </div>
      
    </AdminLayout>
  );
}

// ─── Single thermal label ─────────────────────────────────────
function PrintLabel({ product, variant, generateBarcode }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && variant.barcode) {
      generateBarcode(svgRef.current, variant.barcode);
    }
  }, [variant.barcode]);

  return (
    <div style={{
      width: "45mm", padding: 0, fontFamily: "monospace",
      pageBreakAfter: "always", borderBottom: "1px dashed #ccc", textAlign: "center"
    }}>
      <p style={{ fontSize: "10pt", fontWeight: "bold", margin: "0", lineHeight:'17px' }}>KiranaNeeds Store</p>
      <p style={{ fontSize: "9pt", fontWeight: "bold", margin: "0", lineHeight:'10px',
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {product.name}
      </p>
      <p style={{ fontSize: "10pt", fontWeight: "bold", margin: "0", display: "flex", lineHeight:'17px', alignItems: "center", justifyContent: "center", gap: "4px" }}>
        Qty:{variant.label} | MRP:
        {variant.mrp && (
            <span className="flex gap-2">
            <strike style={{ fontSize: "10pt", fontWeight: "semibold" }}> ₹{variant.mrp}</strike>
            <span style={{ fontSize: "10pt", fontWeight: "bold" }}>₹{variant.price}</span>
            </span>
        )}
        </p>
        <svg ref={svgRef} style={{ width: "100%", maxWidth: "45mm" }} />
        <div className="pb-5"></div>
    </div>
  );
}
