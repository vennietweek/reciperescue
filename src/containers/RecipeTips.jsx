import React, { useState, useEffect } from 'react';
import '../styles/recipeInfo.css';
import axios from 'axios';

export function RecipeTips(props) {
    const { recipe } = props;
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
        const prompt = `Generate 10 cooking tips for the recipe: ${recipe.name}. Deliver your response as an array of tips in JSON format. The tips should be short and sweet, at most two lines, and should be slightly more interesting, lesser-known, or expert tips. The ingredients are ${recipe.ingredients}. The instructions are ${recipe.instructions}`;
        const response = await axios.post('http://localhost:4000/api/get-chat-completion', { message: prompt });
        console.log('Tips response:', response);
        const fetchedTips = response.data.choices[0].message.content.split('\n- ').slice(1);
        setTips(fetchedTips);
        setVisibleTips(fetchedTips.slice(0, 2));
      } catch (error) {
        console.error('Error fetching tips:', error);
      }
    };

    const handleMoreTips = () => {
      const newIndex = tipIndex + 2 < tips.length ? tipIndex + 2 : 0;
      setVisibleTips(tips.slice(newIndex, newIndex + 2));
      setTipIndex(newIndex);
    };

    return (
      <div className="recipe-info-container">
        <div className="recipe-tips-container">
          <h4>Recipe Tips</h4>
          <ol>
            {visibleTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ol>
          {tips.length > 2 && (
            <button onClick={handleMoreTips}>More tips</button>
          )}
        </div>
      </div>
    );
}
