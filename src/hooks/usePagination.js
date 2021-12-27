/*eslint-disable*/
import { useEffect, useState } from "react";

const usePagination = (items = [], options = {}) => {
    const { zeroShift = 0 } = options;
    const [perPage, setPerPage] = useState(options?.perPage ?? 10);
    const [currentPage, setCurrentPage] = useState(0);
    const pagesCount = Math.ceil(items?.length / perPage);
    useEffect(() => {
        try {
            document.getElementById(`scrollWrapper`).scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {}
        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {}
    }, [currentPage]);
    useEffect(() => {
        setCurrentPage(Math.max(Math.min(currentPage, pagesCount - 1), 0));
    }, [perPage]);
    return {
        visibleItems: items?.slice?.(perPage * currentPage, perPage * (currentPage + 1)) ?? [],
        perPage,
        currentPage: currentPage + zeroShift,
        pagesCount,
        totalCount: items?.length,
        handlePerPageChange: (newValue) => {
            setPerPage(Math.max(newValue, 0));
        },
        handleNextPage: () => {
            setCurrentPage(Math.min(currentPage + 1, pagesCount));
        },
        handlePrevPage: () => {
            setCurrentPage(Math.max(currentPage - 1, 0));
        },
        handlePageNavigation: (newValue) => {
            setCurrentPage(Math.min(Math.max(newValue - zeroShift, 0), pagesCount));
        },
        isFirstPage: currentPage === 0,
        isLastPage: currentPage === pagesCount - 1,
    };
};

export default usePagination;
/*eslint-enable*/
