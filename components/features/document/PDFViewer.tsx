"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize2,
    RotateCw,
    Loader2,
    AlertCircle,
} from "lucide-react";

type PDFDocumentProxy = import("pdfjs-dist").PDFDocumentProxy;
type PDFPageProxy = import("pdfjs-dist").PDFPageProxy;
type RenderTask = import("pdfjs-dist").RenderTask;

export interface PDFViewerProps {
    src: string;
    initialPage?: number;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 4.0;
const SCALE_STEP = 0.2;

export function PDFViewer({ src, initialPage = 1 }: PDFViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [pageNum, setPageNum] = useState(initialPage);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fitScale, setFitScale] = useState(1.0);

    const renderTaskRef = useRef<RenderTask | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setPdf(null);

        (async () => {
            const pdfjs = await import("pdfjs-dist");
            // point at bundled worker (Next.js copies it to /_next/static/)
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs",
                import.meta.url
            ).toString();

            try {
                const loadingTask = pdfjs.getDocument({ url: src, cMapPacked: true });
                const doc = await loadingTask.promise;
                if (!cancelled) {
                    setPdf(doc);
                    setPageNum(1);
                }
            } catch (e) {
                if (!cancelled) setError("Failed to load PDF. Please try again.");
                console.error("[PDFViewer] load error", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [src]);

    const computeFitScale = useCallback(
        async (doc: PDFDocumentProxy, pNum: number) => {
            if (!containerRef.current) return;
            const page = await doc.getPage(pNum);
            const vp = page.getViewport({ scale: 1, rotation });
            const containerW = containerRef.current.clientWidth - 32; // padding
            const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, containerW / vp.width));
            setFitScale(s);
            return s;
        },
        [rotation]
    );

    useEffect(() => {
        if (!pdf) return;
        computeFitScale(pdf, pageNum).then((s) => {
            if (s !== undefined) setScale(s);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdf]);

    useEffect(() => {
        if (!pdf || !canvasRef.current) return;
        let cancelled = false;

        (async () => {
            setPageLoading(true);

            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
                renderTaskRef.current = null;
            }

            try {
                const page: PDFPageProxy = await pdf.getPage(pageNum);
                if (cancelled) return;

                const viewport = page.getViewport({ scale, rotation });
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext("2d")!;


                const dpr = window.devicePixelRatio || 1;
                canvas.width = Math.floor(viewport.width * dpr);
                canvas.height = Math.floor(viewport.height * dpr);
                canvas.style.width = `${Math.floor(viewport.width)}px`;
                canvas.style.height = `${Math.floor(viewport.height)}px`;
                ctx.scale(dpr, dpr);

                const renderTask = page.render({
                    canvasContext: ctx,
                    viewport,
                });
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            } catch (e: unknown) {
                if ((e as { name?: string })?.name !== "RenderingCancelledException") {
                    console.error("[PDFViewer] render error", e);
                }
            } finally {
                if (!cancelled) setPageLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pdf, pageNum, scale, rotation]);


    const goPrev = () => setPageNum((n) => Math.max(n - 1, 1));
    const goNext = () => setPageNum((n) => (pdf ? Math.min(n + 1, pdf.numPages) : n));
    const zoomIn = () => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
    const zoomOut = () => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE));
    const fitToWidth = () => setScale(fitScale);
    const rotate = () => setRotation((r) => (r + 90) % 360);

    const totalPages = pdf?.numPages ?? 0;
    const pct = Math.round(scale * 100);


    return (
        <div className="flex flex-col h-full bg-muted/20">

            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">

                <div className="flex items-center gap-1">
                    <button
                        onClick={goPrev}
                        disabled={pageNum <= 1 || !pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                        <span className="text-xs font-medium tabular-nums text-foreground">
                            {totalPages ? pageNum : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">/</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {totalPages || "—"}
                        </span>
                    </div>

                    <button
                        onClick={goNext}
                        disabled={pageNum >= totalPages || !pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                </div>


                <div className="flex items-center gap-1">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= MIN_SCALE || !pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <div className="px-2 py-1 rounded-lg bg-muted/50 min-w-[52px] text-center">
                        <span className="text-xs font-medium tabular-nums text-foreground">
                            {pct}%
                        </span>
                    </div>

                    <button
                        onClick={zoomIn}
                        disabled={scale >= MAX_SCALE || !pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <div className="w-px h-5 bg-border/60 mx-1" />

                    <button
                        onClick={fitToWidth}
                        disabled={!pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Fit to width"
                        title="Fit to width"
                    >
                        <Maximize2 className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <button
                        onClick={rotate}
                        disabled={!pdf}
                        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Rotate"
                    >
                        <RotateCw className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                </div>
            </div>


            <div
                ref={containerRef}
                className="flex-1 overflow-auto flex flex-col items-center py-6 px-4"
            >

                {loading && (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
                        <p className="text-sm font-medium">Loading document…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-destructive">
                        <AlertCircle className="w-8 h-8" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}


                {!loading && !error && (
                    <div className="relative">
                        {pageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
                                <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
                            </div>
                        )}
                        <canvas
                            ref={canvasRef}
                            className="rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10 block"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PDFViewer;
