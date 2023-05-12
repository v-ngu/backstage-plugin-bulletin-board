import React from 'react';
import { Button, Chip, TextField, Box, makeStyles } from '@material-ui/core';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { Header, Page, Content } from '@backstage/core-components';
import { BulletinCard } from '../BulletinCard';
import { FormDialog } from '../FormDialog';
import { bulletinBoardApiRef, Bulletin } from '../../api'
import { useApi } from '@backstage/core-plugin-api';

type BulletinBoardPageProps = {
  title?: string,
  subtitle?: string
};

export const BulletinBoardPage = (props: BulletinBoardPageProps) => {
    const useStyles = makeStyles({
        subHeader: {
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            paddingBottom: '1rem'
        },
        autocComplete: {
            width: 250
        },
        contentBox: {
            minHeight: '83%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        pagination: {
            marginTop: '1rem',
            alignSelf: 'center'
        }
    })

    const classes = useStyles();

    const bulletinBoardApi = useApi(bulletinBoardApiRef);
    const fetchCards = async (): Promise<void> => {
        const res = await bulletinBoardApi.getBulletins();
        const data = await res.data;
        await data.forEach((obj: any) => {
            obj.bulletin_tags = obj.bulletin_tags
                .split(",")
                .filter((tag: string) => tag !== "");
        })
        setAllCards(data);
    }
    
    const [allCards, setAllCards] = React.useState([]);
    React.useEffect(() => {
        fetchCards()
    }, [])

    const [currentCardId, setCurrentCardId] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [availableTags, setAvailableTags] = React.useState<Array<string>>([]);
    const [selectedFilter, setSelectedFilter] = React.useState<string | null>("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [cardsPerPage] = React.useState(9);
    const [numberOfPages, setNumberOfPages] = React.useState(0)
    
    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);
    const findCurrentCard = () => allCards.find((item: Bulletin) => item.bulletin_id === currentCardId);

    const getCardsOnPage = () => {
        const sliceAt = currentPage * cardsPerPage;
        const firstIndex = sliceAt - cardsPerPage;
        return allCards.slice(firstIndex, sliceAt);
    }

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number): void => {
        setCurrentPage(page);
    }

    // Go through every card to get all the available tags to populate filter menu
    const getAvailableTags = (): Array<string> => {
        return allCards.reduce((allTags: Array<string>, itemArr: Bulletin) => {
            return [...allTags, ...itemArr.bulletin_tags];
        }, [])
            .filter((item, index, arr) => index === arr.lastIndexOf(item))
            .sort();
    }
    
    // Create tag pills to display for both with or without deletable option
    const tagElements = (
        tagArr: [], 
        deletable: boolean, 
        handleDelete: (tag: string) => void
    ) => {
        if (deletable) {
            return tagArr.map((tag, index) => (
                <Chip 
                    label={tag} 
                    key={index} 
                    size="small" 
                    onDelete={() => handleDelete(tag)}
                />
            ))
        } else if (tagArr.length === 0) {
            return;
        } else {
            return tagArr.map((tag, index) => (
                <Chip label={tag} key={index} size="small"/>
            ))
        }
    }

    const addNewCard = async (newCard: Bulletin) => {
        const res = await bulletinBoardApi.createBulletin(newCard);
        if (res.status === "ok") {
            fetchCards();
        }
    }

    const confirmEdit = async (id: string, existingCard: Bulletin) => {
        const res = await bulletinBoardApi.updateBulletin(id, existingCard);
        if (res.status === "ok") {
            fetchCards();
        }
    }

    const deleteCard = async (id: string) => {
        const res: Awaited<Promise<any>> = await bulletinBoardApi.deleteBulletin(id);
        if (res.status === "ok") {
            fetchCards();
        }
    }

    const handleFilter = (_event: React.ChangeEvent<{}>, value: string | null): void => {
        setSelectedFilter(value);
    }

    React.useEffect(() => {
        setAvailableTags(getAvailableTags);
        setNumberOfPages(Math.ceil(allCards.length / cardsPerPage))
    }, [allCards])

    return(
        <Page themeId="home">
            <Header title={props.title ?? 'Bulletin Board'} subtitle={props.subtitle ?? 'A basic place to share ideas and links with your team.'} />
            <Content>
                <FormDialog
                    status={open}
                    closeDialog={closeDialog}
                    tags={tagElements}
                    addNewCard={addNewCard}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    currentCard={findCurrentCard}
                    confirmEdit={confirmEdit}
                    deleteCard={deleteCard}
                />
                <Box className={classes.subHeader}>
                    <Autocomplete
                        className={classes.autocComplete}
                        id="filterByCategory"
                        size="small"
                        options={availableTags}
                        renderInput={(params) => 
                            (<TextField {...params} label="Filter by Category" variant="outlined"/>)
                        }
                        onChange={handleFilter}
                    />
                    <Button 
                        color="primary" 
                        variant="contained"
                        onClick={openDialog}
                    >
                        Add new bulletin
                    </Button>
                </Box>
                <Box className={classes.contentBox}>
                    <BulletinCard 
                        allCards={allCards} 
                        tags={tagElements} 
                        setCurrentCardId={setCurrentCardId}
                        openDialog={openDialog}
                        setEditMode={setEditMode}
                        selectedFilter={selectedFilter}
                        getCardsOnPage={getCardsOnPage}
                    />
                    <Pagination
                        className={classes.pagination}
                        count={numberOfPages}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Box>
            </Content>
        </Page>
    )
};