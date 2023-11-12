import React, { useState, useEffect } from 'react';
import '../styles/RecipeInfo.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';

const sampleTips = [
  "Use guanciale for authentic flavor.",
  "Cook pasta al dente for the perfect texture.",
  "Save pasta water for adjusting sauce consistency.",
  "Stick to eggs, no cream in traditional carbonara.",
  "Mix eggs and cheese off heat to avoid scrambling.",
  "Toss pasta with sauce in the pan, not just pour it on.",
  "Add a pinch of red pepper flakes for a subtle kick.",
  "Opt for Pecorino Romano cheese for extra sharpness.",
  "Let pasta cool slightly before adding the egg mixture.",
  "Finish with freshly cracked black pepper for aroma."
];

export function RecipeTips(props) {

    const [recipe] = useState(props.recipe);
    const [tips, setTips] = useState([]);
    const [visibleTips, setVisibleTips] = useState([]);
    const [tipIndex, setTipIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (recipe) {
        getTips();
      }
    }, [recipe]); 
    
    const getTips = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/getTips?name=' + recipe.title + '&ingredients=' + recipe.ingredients.map((i) => i.name).toString()  + '&instructions=' + recipe.instructions.toString());
        const fetchedTips = response.data;
        setTips(fetchedTips);
        setVisibleTips(fetchedTips.slice(0, 2));
      } catch (error) {
        console.error('Error fetching tips:', error);
        setTips('There was an error fetching tips.');
      }
        finally {
          setIsLoading(false); 
      }
    };

    const handleMoreTips = () => {
      const newIndex = tipIndex + 2 < tips.length ? tipIndex + 2 : 0;
      setVisibleTips(tips.slice(newIndex, newIndex + 2));
      setTipIndex(newIndex);
    };

    const handlePreviousTips = () => {
      const newIndex = tipIndex - 2 >= 0 ? tipIndex - 2 : 0;
      setVisibleTips(tips.slice(newIndex, newIndex + 2));
      setTipIndex(newIndex);
    };

    return (
      <div className="recipe-detail-container">
        <h4>Recipe Tips</h4>
        {isLoading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="xl" style={{color: "#6f66f0",}} />
            <br /><br />
            <p className='chatgpt-credit'>Powered by ChatGPT</p>
          </div>
        ) : (
          <>
            <div className="recipe-tips">
              <ul>
                {visibleTips.map((tip, index) => (
                  <li key={`${tipIndex}-${index}`} className="fade-in">
                    {tipIndex + index + 1}. {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tips-navigation">
              {tipIndex > 0 && (
                <Button variant="link" onClick={handlePreviousTips}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Previous Tips
                </Button>
              )}
              <div className="spacer"></div>
              {tips.length > 2 && tipIndex < tips.length - 2 && (
                <Button variant="link" onClick={handleMoreTips}>
                  More Tips <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }    