import React, { useState, useEffect } from 'react';
import '../styles/RecipeInfo.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


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

    const [recipe] = useState(props);
    const [tips, setTips] = useState([]);
    const [visibleTips, setVisibleTips] = useState([]);
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
      if (recipe) {
        getTips();
      }
    }, [recipe]); 
    
    const getTips = async () => {
      try {
        const prompt = `Generate 10 cooking tips for the recipe: ${recipe.name}. Deliver your response as an array of tips in code format. Do not provide any other response before or after the code. The tips should be short and sweet, at most two lines, and should be slightly more interesting, lesser-known, or expert tips. The ingredients are ${recipe.ingredients}. The instructions are ${recipe.instructions}`;
        const response = await axios.post('http://localhost:4000/api/get-chat-completion', { message: prompt });
        console.log('Tips response:', response);
        const fetchedTips = response.data.choices[0].message.content.split('\n- ').slice(1);
        setTips(fetchedTips);
        setVisibleTips(fetchedTips.slice(0, 2));
      } catch (error) {
        console.error('Error fetching tips:', error);
        setTips(sampleTips);
        setVisibleTips(sampleTips.slice(0, 2));
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
          <p><h4>Recipe Tips</h4></p>
          <ul>
            {visibleTips.map((tip, index) => (
              <li key={`${tipIndex}-${index}`} className="fade-in">
                {tipIndex + index + 1}. {tip}
              </li>
            ))}
          </ul>
          <div className="tips-navigation">
            {tipIndex > 0 && (
              <Button variant="link" onClick={handlePreviousTips}>
                <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Previous Tips
              </Button>
            )}
            {!tipIndex > 0 && <div></div>}
            {tips.length > 2 && tipIndex < tips.length - 2 && (
              <Button variant="link" onClick={handleMoreTips}>
                More Tips &nbsp;<FontAwesomeIcon icon={faArrowRight} />
              </Button>
            )}
          </div>
      </div>
    );
}
