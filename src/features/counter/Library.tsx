import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchImagesAsync, selectImages, addImageAsync, deleteImageAsync, select, deselect, selectSelected } from './librarySlice';
import styles from './Library.module.css';
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import PrintIcon from '@mui/icons-material/Print';

export function Library() { 
       
    const images = useAppSelector(selectImages);
    const selected = useAppSelector(selectSelected);
    const dispatch = useAppDispatch();
    const fileInput: React.RefObject<any> = React.createRef();

    const pinSizes: PinSize[] = [
        {name: '1.25', size: 1.25, class: 'one-two-five'},
        {name: '1.5', size: 1.5, class: 'one-five'},
        {name: '2', size: 2, class: 'two'},
    ]    
    const [pinSize, setPinsize] = useState(pinSizes[0]);
    const [fileName, setfileName] = useState('');

    const [pages, setPages] = useState(1);
    
    const maxPerPage = 48
    const maxPrint = maxPerPage * pages
    const printArrayLimit = Array.from(selected, (e) => Array(Math.ceil(maxPrint/selected.length)).fill(e)).flat()
    printArrayLimit.length = maxPrint

    useEffect( () => { dispatch(fetchImagesAsync())}, [dispatch] )

    const handlePages = (event: ChangeEvent) => {
        if (!event.target)  return false
        const pNum = parseInt((event.target as HTMLInputElement).value)
        setPages((!isNaN(pNum) && pNum >= 1) ? pNum : 1)
     }
    
    const submit = (event: FormEvent<HTMLFormElement>) => { 
        event.preventDefault()
        dispatch(addImageAsync(fileInput.current.files[0]))
        setfileName('')
    }

    const toggleSelect = (image: string) => { 
        dispatch( (selected.includes(image)) ? deselect(image) : select(image) )
    }

    const deleteImage = (event: React.MouseEvent, image: string) => { 
        event.preventDefault()
        event.stopPropagation()
        if (window.confirm('Delete permanantly')) {
            if (selected.includes(image)) {
                dispatch(deselect(image))
            }
            dispatch(deleteImageAsync(image))
        }
    }

    return (
        <div>
            <h2>My Library</h2>
            <div className={styles.controls}>
                <form action="" method="post" onSubmit={submit}>
                    <input
                        className={styles.visuallyHidden}
                        onChange={() => { setfileName(fileInput.current.files[0].name)}}
                        ref={fileInput} type="file" name="new-image" id="new-image" />
                    <span>{ fileName }</span>
                    <Button
                        endIcon={<DriveFileMoveIcon/>}
                        variant="contained" type="button" onClick={() => { 
                        document.getElementById('new-image')?.click()
                    }}>Pick File</Button>
                    <Button
                        endIcon={<FileUploadIcon/>}
                        variant="contained"
                        disabled={ fileName === '' }
                        type="submit">Upload</Button>
                </form>

                {/* <div>
                    <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Pin Size</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                            {pinSizes.map((e, i) => {
                                return <FormControlLabel key={i} value={e} control={<Radio />} label={e.name} />
                            })}
                    </RadioGroup>
                    </FormControl>
                </div> */}
                <div>
                    <TextField id="pages" label="Pages" type="number" variant="standard" value={pages} onChange={(e) => handlePages(e)}/>
                </div>
                <div><Button
                    variant="contained"
                    endIcon={<PrintIcon/>}
                    disabled={ selected.length < 1}
                    onClick={() => window.print()}>Print</Button></div>

            </div>

            <div className={styles.gallery}>
                {images.map((image: string, i: number) => {
                    return <div key={i} className={styles.libraryImage} onClick={() => toggleSelect(image)}>
                        <img
                            src={image} className={`App-logo ${selected.includes(image) ? styles.selected : ''}`} alt="logo" />
                        <IconButton
                            onClick={(event: React.MouseEvent) => deleteImage(event, image)}>
                            <DeleteForeverIcon color='warning'></DeleteForeverIcon></IconButton>
                    </div>
                })}
            </div>

            <div className={styles.printGrid}>

                {printArrayLimit.map((image, i) => {
                    return <div key={i} className={ `${styles.printCell} ${(((i + 1) % maxPerPage) === 0)?styles.pageBreak:''}` } >
                        <img src={image} className={ styles.printImage } alt="logo" />
                    </div>
                })}
            
            </div>
        </div>
    )
}

interface PinSize { 
    name: string;
    class: string;
    size: number;
}