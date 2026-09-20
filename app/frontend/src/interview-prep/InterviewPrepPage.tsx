import React, { useState } from "react"
import { connect } from "react-redux"
import { useDebounce } from "./hooks/useDebouncePrep"
import { RootState } from "reducers"
import { Button } from "@mui/material"

const InterviewPrepPage: React.FC = ({}) => {
    const [searchText, setSearchText] = useState<string>("")
    const [displayedText, setDisplayedText] = useState<string>("")
    const debouncedText = useDebounce(searchText, 1000)

    return (
        <>
            <div className="flex flex-col items-center content-center w-full h-full p-[5rem]">
                <div className="flex w-[66%] h-[100%] p-[5rem] mb-[1rem]">
                    <input
                        className="w-full border border-gray-500 rounded-lg px-3 py-2 text-[1.4rem] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        className="!ml-[2rem] w-[20rem]"
                        sx={{ margin: "0.2rem", fontSize: "1.4rem" }}
                        onClick={() => setDisplayedText(debouncedText)}
                    >
                        {"Display Text!"}
                    </Button>
                </div>
                {displayedText}
            </div>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({ state: state })

export default connect(mapStateToProps, {})(InterviewPrepPage)
