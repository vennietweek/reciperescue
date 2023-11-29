import React from 'react';
import '../styles/NutritionTable.css'

function NutritionTable() {
  const nutritionData = [
    {
      "name": "Calories",
      "amount": 316.49,
      "unit": "kcal",
      "percentOfDailyNeeds": 15.82
    },
    {
      "name": "Fat",
      "amount": 12.09,
      "unit": "g",
      "percentOfDailyNeeds": 18.6
    },
    {
      "name": "Saturated Fat",
      "amount": 3.98,
      "unit": "g",
      "percentOfDailyNeeds": 24.88
    },
    {
      "name": "Carbohydrates",
      "amount": 49.25,
      "unit": "g",
      "percentOfDailyNeeds": 16.42
    },
    {
      "name": "Net Carbohydrates",
      "amount": 46.76,
      "unit": "g",
      "percentOfDailyNeeds": 17.0
    },
    {
      "name": "Sugar",
      "amount": 21.98,
      "unit": "g",
      "percentOfDailyNeeds": 24.42
    },
    {
      "name": "Cholesterol",
      "amount": 1.88,
      "unit": "mg",
      "percentOfDailyNeeds": 0.63
    },
    {
      "name": "Sodium",
      "amount": 279.1,
      "unit": "mg",
      "percentOfDailyNeeds": 12.13
    },
    {
      "name": "Protein",
      "amount": 3.79,
      "unit": "g",
      "percentOfDailyNeeds": 7.57
    }
  ];

  return (
    <div className="nutrition-label">
      <h2 className="label-heading">Nutritional Facts</h2>
      <table>
        <tbody>
          {nutritionData.map((item, index) => (
            <tr key={index}>
              <td className="label-name">{item.name}</td>
              <td className="label-amount">{item.amount.toFixed(2)}{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NutritionTable;
