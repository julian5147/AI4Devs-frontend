import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Container, Row } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCandidates,
  getInterviewFlow,
  updateCandidateStep,
} from "../services/positionService";
import { Candidate, Process } from "../types/position";
import "../styles/Position.css";

const ScoreDots: React.FC<{ score: number; maxScore: number }> = ({
  score,
  maxScore,
}) => {
  return (
    <div className="score-dots">
      {[...Array(maxScore)].map((_, i) => (
        <div
          key={i}
          className={`score-dot ${i < score ? "" : "score-dot-empty"}`}
        />
      ))}
    </div>
  );
};

const Position: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setInterviewFlow] = useState<Process | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [flowData, candidatesData] = await Promise.all([
          getInterviewFlow(id),
          getCandidates(id),
        ]);

        setInterviewFlow(flowData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !process) return;

    const { draggableId, destination } = result;
    const newStepId = destination.droppableId;

    try {
      await updateCandidateStep(draggableId, draggableId, newStepId);

      const updatedCandidates = candidates.map((candidate) => {
        if (candidate.fullName === draggableId) {
          return {
            ...candidate,
            currentInterviewStep:
              process.interviewFlow.interviewFlow.interviewSteps.find(
                (step) => step.id === parseInt(newStepId)
              )?.name || candidate.currentInterviewStep,
          };
        }
        return candidate;
      });
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error updating candidate stage:", error);
    }
  };

  if (!process) return <div>Cargando...</div>;

  return (
    <Container fluid className="mt-4">
      <div className="d-flex align-items-center mb-4">
        <ArrowLeft
          className="me-3"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={() => navigate("/positions")}
        />
        <h2 className="mb-0">{process.interviewFlow.positionName}</h2>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Row className="g-4">
          {process.interviewFlow.interviewFlow.interviewSteps.map((step) => (
            <Col key={step.id} xs={12} md={6} lg={3}>
              <div className="interview-column">
                <div className="interview-column-header">{step.name}</div>
                <Droppable droppableId={step.id.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-height-300"
                    >
                      {candidates
                        .filter(
                          (candidate) =>
                            candidate.currentInterviewStep === step.name
                        )
                        .map((candidate, index) => (
                          <Draggable
                            key={candidate.fullName}
                            draggableId={candidate.fullName}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="candidate-card"
                              >
                                <div className="p-3">
                                  <h6 className="mb-2">{candidate.fullName}</h6>
                                  <ScoreDots
                                    score={candidate.averageScore}
                                    maxScore={5}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </Container>
  );
};

export default Position;
