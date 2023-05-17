import React from 'react';
import { ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { 
    Typography, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardMedia,
    IconButton
} from '@material-ui/core';
import { Bulletin } from '../../api'
import EditIcon from '@material-ui/icons/Edit'
import { DateTime } from 'luxon';

export const BulletinCard = (props: any) => {
    const editDialog = (id: string) => {
        props.setCurrentCardId(id);
        props.setEditMode(true);
        props.openDialog();
    }

    const showcaseCards = () => {
        if (props.selectedFilter) {
            return props.allCards.filter((individualCard: Bulletin) => (
                individualCard.bulletin_tags.includes(props.selectedFilter)
            ))
        } else {
            return props.getCardsOnPage();
        }
    }

    const siteElements = showcaseCards().map((individualCard: Bulletin) => (
        <Card key={individualCard.bulletin_id}>
        <CardMedia>
            <ItemCardHeader 
                title={individualCard.bulletin_title}
                subtitle={`updated ${DateTime.fromISO(
                    new Date(individualCard.updated_at!).toISOString(),
                  ).toRelative({
                    base: DateTime.now(),
                  })}`}
            /> 
        </CardMedia>
        <CardContent>
            <Typography>
                {individualCard.bulletin_description}
            </Typography>
        </CardContent>
        <CardContent>
            {props.tags(individualCard.bulletin_tags)}
        </CardContent>
        <CardActions>
            <IconButton onClick={() => editDialog(individualCard.bulletin_id)} id="editButton">
                <EditIcon />
            </IconButton>
            {
                individualCard.bulletin_url &&
                <Button 
                    color="primary" 
                    variant="contained"  
                    href={
                        individualCard.bulletin_url.startsWith("http") 
                        ? individualCard.bulletin_url 
                        : `//${individualCard.bulletin_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open URL
                </Button>
            }
        </CardActions>
        </Card>
    ))
    
    return(
        <ItemCardGrid>
            {siteElements}
        </ItemCardGrid>
    )
}