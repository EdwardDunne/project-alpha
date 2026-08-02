import { Autocomplete, TextField } from "@mui/material"
import { getAllSubCategories } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { SubCategory } from "../types"
import { RootState } from "../reducers"

interface Props {
    setSubCategory: (subCategory: SubCategory | null) => void
    variant?: "standard" | "outlined" | "filled"
    allSubCategories: SubCategory[]
    getAllSubCategories: () => void
    initialSubCategoryId?: number
    extraClasses?: string
}

const SubCategorySelector: React.FC<Props> = ({
    setSubCategory,
    variant = "standard",
    allSubCategories,
    getAllSubCategories,
    initialSubCategoryId,
    extraClasses,
}) => {
    const [subCategoryOptions, setSubCategoryOptions] = useState<
        SubCategory[]
    >([])
    const [selectedSubCategory, setSelectedSubCategory] =
        useState<SubCategory | null>(null)

    useEffect(() => {
        allSubCategories.length
            ? _setSubCategoryOptions(allSubCategories)
            : getAllSubCategories()
    }, [])

    useEffect(() => {
        _setSubCategoryOptions(allSubCategories)
    }, [allSubCategories])

    useEffect(() => {
        if (initialSubCategoryId && !selectedSubCategory) {
            const match = subCategoryOptions.find(
                (s) => s.id === initialSubCategoryId,
            )
            if (match) {
                setSelectedSubCategory(match)
                setSubCategory(match)
            }
        }
    }, [initialSubCategoryId, subCategoryOptions])

    const _setSubCategoryOptions = (subCategories: SubCategory[]) => {
        setSubCategoryOptions(
            [...subCategories].sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
            ),
        )
    }

    return (
        <div className={"mt-3 " + extraClasses}>
            <Autocomplete
                id="sub-category-selector"
                options={subCategoryOptions}
                value={selectedSubCategory}
                getOptionLabel={(option) => option["name"]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Sub Category"
                        variant={variant}
                        InputProps={{
                            ...params.InputProps,
                            sx: { fontSize: "1.6rem" },
                        }}
                        InputLabelProps={{
                            ...params.InputLabelProps,
                            sx: { fontSize: "1.6rem" },
                        }}
                    />
                )}
                onChange={(e, subCategory) => {
                    setSelectedSubCategory(subCategory)
                    setSubCategory(subCategory)
                }}
                slotProps={{ paper: { sx: { fontSize: "1.6rem" } } }}
                sx={{
                    "& .MuiAutocomplete-popupIndicator svg": {
                        fontSize: "2rem",
                    },
                    "& .MuiAutocomplete-clearIndicator svg": {
                        fontSize: "2rem",
                    },
                }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allSubCategories: state.comics.all_sub_categories,
})
export default connect(mapStateToProps, { getAllSubCategories })(
    SubCategorySelector,
)
